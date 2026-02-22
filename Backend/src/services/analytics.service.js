const { StatusCodes } = require("http-status-codes");
const ActivityLog = require("../models/ActivityLog");
const ApiError = require("../utils/ApiError");
const { buildCsv } = require("../utils/csv");
const {
  DAY_LABELS,
  ORDERED_DAY_LABELS,
  buildTimeRangeQuery,
  getRangeLabel,
  getPreviousRangeBounds,
  getPreviousRangeLabel,
  formatDateForUi,
  formatDateForDataset,
} = require("../utils/date");

const normalizeFilterValue = (value) => {
  if (!value || value === "All") {
    return null;
  }
  return String(value).trim();
};

const resolveClassFilter = ({ className, grade }) => {
  const normalizedClass = normalizeFilterValue(className);
  if (normalizedClass) {
    return normalizedClass;
  }

  return normalizeFilterValue(grade);
};

const getLatestDatasetDate = async () => {
  const latest = await ActivityLog.findOne({}, { createdAt: 1 }).sort({ createdAt: -1 }).lean();
  return latest ? latest.createdAt : null;
};

const buildActivityFilter = ({
  latestDate,
  timeRange = "week",
  classFilter,
  subject,
  teacherId,
  createdAtQuery,
}) => {
  const filter = {};

  if (teacherId) {
    filter.teacherId = teacherId;
  }

  const normalizedSubject = normalizeFilterValue(subject);

  if (classFilter) {
    filter.class = classFilter;
  }

  if (normalizedSubject) {
    filter.subject = normalizedSubject;
  }

  if (createdAtQuery) {
    filter.createdAt = createdAtQuery;
  } else if (latestDate) {
    filter.createdAt = buildTimeRangeQuery(latestDate, timeRange);
  }

  return filter;
};

const buildEmptyWeeklyData = () =>
  ORDERED_DAY_LABELS.map((day) => ({
    name: day,
    value: 0,
    secondaryValue: 0,
  }));

const toCountMap = (rows) =>
  rows.reduce((map, row) => {
    map.set(row._id, row.count);
    return map;
  }, new Map());

const toPercentDelta = (currentValue, previousValue) => {
  if (previousValue <= 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return Math.round(((currentValue - previousValue) / previousValue) * 100);
};

const buildPreviousPeriodFilter = ({ latestDate, timeRange, classFilter, subject, teacherId }) => {
  const previousRange = getPreviousRangeBounds(latestDate, timeRange);

  return buildActivityFilter({
    classFilter,
    subject,
    teacherId,
    createdAtQuery: {
      $gte: previousRange.start,
      $lt: previousRange.end,
    },
  });
};

const generateAiPulseSummary = async ({ latestDate, timeRange, classFilter, subject }) => {
  if (!latestDate) {
    return {
      items: [],
      summaryText: "No activity data is available yet.",
    };
  }

  const currentFilter = buildActivityFilter({
    latestDate,
    timeRange,
    classFilter,
    subject,
  });
  const previousFilter = buildPreviousPeriodFilter({
    latestDate,
    timeRange,
    classFilter,
    subject,
  });
  const currentRangeLabel = getRangeLabel(timeRange).toLowerCase();
  const previousRangeLabel = getPreviousRangeLabel(timeRange);

  const [
    currentQuizRows,
    previousQuizRows,
    currentClassRows,
    lessonPlanRows,
    currentActivityCount,
    previousActivityCount,
  ] = await Promise.all([
    ActivityLog.aggregate([
      {
        $match: {
          ...currentFilter,
          activityType: "Quiz",
        },
      },
      {
        $group: {
          _id: "$teacherName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]),
    ActivityLog.aggregate([
      {
        $match: {
          ...previousFilter,
          activityType: "Quiz",
        },
      },
      {
        $group: {
          _id: "$teacherName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]),
    ActivityLog.aggregate([
      { $match: currentFilter },
      {
        $group: {
          _id: "$class",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, _id: 1 } },
    ]),
    ActivityLog.aggregate([
      {
        $match: {
          ...currentFilter,
          activityType: "Lesson Plan",
        },
      },
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: 1, _id: 1 } },
    ]),
    ActivityLog.countDocuments(currentFilter),
    ActivityLog.countDocuments(previousFilter),
  ]);

  const insights = [];
  const previousQuizMap = toCountMap(previousQuizRows);

  if (currentQuizRows.length > 0) {
    let bestQuizInsight = null;

    currentQuizRows.forEach((row) => {
      const previousCount = previousQuizMap.get(row._id) || 0;
      const delta = row.count - previousCount;
      const percentDelta = toPercentDelta(row.count, previousCount);

      if (
        !bestQuizInsight ||
        delta > bestQuizInsight.delta ||
        (delta === bestQuizInsight.delta && row.count > bestQuizInsight.currentCount)
      ) {
        bestQuizInsight = {
          teacher: row._id,
          currentCount: row.count,
          previousCount,
          delta,
          percentDelta,
        };
      }
    });

    if (bestQuizInsight && bestQuizInsight.delta > 0) {
      insights.push({
        id: "ai-1",
        title: `${bestQuizInsight.teacher} created ${bestQuizInsight.percentDelta}% more quizzes ${currentRangeLabel}`,
        description: `${bestQuizInsight.currentCount} quizzes vs ${bestQuizInsight.previousCount} in ${previousRangeLabel}.`,
        category: "workload",
        color: "purple",
      });
    } else {
      const topQuizTeacher = currentQuizRows[0];
      insights.push({
        id: "ai-1",
        title: `${topQuizTeacher._id} leads quiz creation ${currentRangeLabel}`,
        description: `${topQuizTeacher.count} quizzes logged in the selected period.`,
        category: "workload",
        color: "purple",
      });
    }
  } else {
    insights.push({
      id: "ai-1",
      title: `No quizzes were created ${currentRangeLabel}`,
      description: "Consider encouraging more formative assessments.",
      category: "alert",
      color: "yellow",
    });
  }

  if (currentClassRows.length > 0) {
    const topClass = currentClassRows[0];
    const totalClassActivity = currentClassRows.reduce((sum, row) => sum + row.count, 0);
    const classShare = totalClassActivity > 0 ? Math.round((topClass.count / totalClassActivity) * 100) : 0;

    insights.push({
      id: "ai-2",
      title: `Class ${topClass._id} contributed ${classShare}% of activity ${currentRangeLabel}`,
      description: `${topClass.count} activities logged from this class.`,
      category: "enrollment",
      color: "green",
    });
  } else {
    insights.push({
      id: "ai-2",
      title: `No class activity detected ${currentRangeLabel}`,
      description: "Apply broader class filters to inspect activity distribution.",
      category: "enrollment",
      color: "green",
    });
  }

  if (lessonPlanRows.length > 0) {
    const leastActiveSubject = lessonPlanRows[0];
    insights.push({
      id: "ai-3",
      title: `${leastActiveSubject._id} has the lowest lesson plan output ${currentRangeLabel}`,
      description: `Only ${leastActiveSubject.count} lesson plans were created.`,
      category: "alert",
      color: "yellow",
    });
  } else {
    insights.push({
      id: "ai-3",
      title: `No lesson plans were submitted ${currentRangeLabel}`,
      description: "Send reminders to teachers to maintain planning consistency.",
      category: "alert",
      color: "orange",
    });
  }

  if (previousActivityCount <= 0 && currentActivityCount > 0) {
    insights.push({
      id: "ai-4",
      title: `Teacher activity started strongly ${currentRangeLabel}`,
      description: `${currentActivityCount} activities logged with no baseline in ${previousRangeLabel}.`,
      category: "info",
      color: "blue",
    });
  } else {
    const periodDelta = toPercentDelta(currentActivityCount, previousActivityCount);
    const trendDirection = periodDelta >= 0 ? "up" : "down";
    const trendColor = periodDelta >= 0 ? "blue" : "rose";

    insights.push({
      id: "ai-4",
      title: `Overall teacher activity is ${trendDirection} ${Math.abs(periodDelta)}% ${currentRangeLabel}`,
      description: `${currentActivityCount} activities vs ${previousActivityCount} in ${previousRangeLabel}.`,
      category: "info",
      color: trendColor,
    });
  }

  const summaryText = insights
    .slice(0, 2)
    .map((insight) => `${insight.title} ${insight.description}`)
    .join(" ");

  return {
    items: insights,
    summaryText,
  };
};

const getDashboardOverview = async ({
  timeRange = "week",
  class: className = "All",
  grade = "All",
  subject = "All",
  search = "",
}) => {
  const latestDate = await getLatestDatasetDate();
  const classFilter = resolveClassFilter({ className, grade });

  const activityFilter = buildActivityFilter({
    latestDate,
    timeRange,
    classFilter,
    subject,
  });

  const [metricSummary, weeklyRows] = await Promise.all([
    ActivityLog.aggregate([
      { $match: activityFilter },
      {
        $group: {
          _id: null,
          teacherIds: { $addToSet: "$teacherId" },
          lessonsCreated: {
            $sum: { $cond: [{ $eq: ["$activityType", "Lesson Plan"] }, 1, 0] },
          },
          assessmentsMade: {
            $sum: { $cond: [{ $eq: ["$activityType", "Question Paper"] }, 1, 0] },
          },
          quizzesConducted: {
            $sum: { $cond: [{ $eq: ["$activityType", "Quiz"] }, 1, 0] },
          },
        },
      },
    ]),
    ActivityLog.aggregate([
      { $match: activityFilter },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const summary = metricSummary[0] || {
    teacherIds: [],
    lessonsCreated: 0,
    assessmentsMade: 0,
    quizzesConducted: 0,
  };

  const activeTeachers = summary.teacherIds.length;
  const lessonsCreated = summary.lessonsCreated;
  const assessmentsMade = summary.assessmentsMade;
  const quizzesConducted = summary.quizzesConducted;
  const totalActivity = lessonsCreated + assessmentsMade + quizzesConducted;
  const submissionRate =
    totalActivity > 0 ? `${Math.round((quizzesConducted / totalActivity) * 100)}%` : "0%";

  const rangeLabel = getRangeLabel(timeRange);

  const metrics = [
    {
      id: "1",
      label: "Active Teachers",
      value: activeTeachers,
      sublabel: rangeLabel,
      iconType: "users",
      color: "purple",
    },
    {
      id: "2",
      label: "Lessons Created",
      value: lessonsCreated,
      sublabel: rangeLabel,
      iconType: "book",
      color: "green",
    },
    {
      id: "3",
      label: "Assessments Made",
      value: assessmentsMade,
      sublabel: rangeLabel,
      iconType: "file-text",
      color: "rose",
    },
    {
      id: "4",
      label: "Quizzes Conducted",
      value: quizzesConducted,
      sublabel: rangeLabel,
      iconType: "book",
      color: "yellow",
    },
    {
      id: "5",
      label: "Submission Rate",
      value: submissionRate,
      sublabel: rangeLabel,
      iconType: "award",
      color: "purple",
    },
  ];

  const dayCounts = new Map();

  weeklyRows.forEach((row) => {
    const dayLabel = DAY_LABELS[row._id - 1];
    dayCounts.set(dayLabel, row.count);
  });

  const weeklyData =
    weeklyRows.length === 0
      ? buildEmptyWeeklyData()
      : ORDERED_DAY_LABELS.map((day) => {
          const count = dayCounts.get(day) || 0;
          return {
            name: day,
            value: count,
            secondaryValue: Math.max(0, Number((count * 0.6).toFixed(1))),
          };
        });

  const aiInsights = await generateAiPulseSummary({
    latestDate,
    timeRange,
    classFilter,
    subject,
  });
  const pulseItems = aiInsights.items;
  const normalizedSearch = String(search || "").trim().toLowerCase();

  const pulseData =
    normalizedSearch.length === 0
      ? pulseItems
      : pulseItems.filter((item) =>
          `${item.title} ${item.description}`.toLowerCase().includes(normalizedSearch)
        );

  return {
    metrics,
    weeklyData,
    pulseData,
    aiSummary: aiInsights.summaryText,
  };
};

const getAvailableFilters = async () => {
  const [classes, subjects] = await Promise.all([
    ActivityLog.distinct("class"),
    ActivityLog.distinct("subject"),
  ]);
  const sortedClasses = classes.sort();

  return {
    classes: sortedClasses,
    grades: sortedClasses,
    subjects: subjects.sort(),
  };
};

const getTeacherDirectory = async ({
  search = "",
  class: className = "All",
  grade = "All",
  subject = "All",
  page = 1,
  limit = 50,
}) => {
  const logs = await ActivityLog.find({}, { teacherId: 1, teacherName: 1, subject: 1, class: 1 })
    .sort({ _id: 1 })
    .lean();

  const teacherMap = new Map();

  logs.forEach((entry) => {
    if (teacherMap.has(entry.teacherId)) {
      return;
    }

    teacherMap.set(entry.teacherId, {
      id: entry.teacherId,
      name: entry.teacherName,
      subject: entry.subject,
      class: entry.class,
      grade: entry.class,
    });
  });

  let teachers = Array.from(teacherMap.values());

  const normalizedSearch = String(search || "").trim().toLowerCase();
  const classFilter = resolveClassFilter({ className, grade });
  const normalizedSubject = normalizeFilterValue(subject);

  if (normalizedSearch) {
    teachers = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(normalizedSearch) ||
        teacher.subject.toLowerCase().includes(normalizedSearch)
    );
  }

  if (classFilter) {
    teachers = teachers.filter((teacher) => teacher.class === classFilter);
  }

  if (normalizedSubject) {
    teachers = teachers.filter((teacher) => teacher.subject === normalizedSubject);
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 50);
  const total = teachers.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / safeLimit);
  const start = (safePage - 1) * safeLimit;
  const items = teachers.slice(start, start + safeLimit);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
};

const getTeacherOverview = async ({
  teacherId,
  timeRange = "week",
  class: className = "All",
  grade = "All",
  subject = "All",
}) => {
  const allTeacherLogs = await ActivityLog.find({ teacherId }).sort({ _id: 1 }).lean();

  if (allTeacherLogs.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Teacher "${teacherId}" was not found.`);
  }

  const latestDate = await getLatestDatasetDate();
  const classFilter = resolveClassFilter({ className, grade });
  const activityFilter = buildActivityFilter({
    latestDate,
    timeRange,
    classFilter,
    subject,
    teacherId,
  });

  const filteredLogs = await ActivityLog.find(activityFilter).sort({ createdAt: -1 }).lean();

  const teacherName = allTeacherLogs[0].teacherName;
  const subjects = [...new Set(allTeacherLogs.map((entry) => entry.subject))];
  const grades = [...new Set(allTeacherLogs.map((entry) => `Grade ${entry.class}`))].sort();

  const lessonsCreated = filteredLogs.filter((entry) => entry.activityType === "Lesson Plan").length;
  const quizzesConducted = filteredLogs.filter((entry) => entry.activityType === "Quiz").length;
  const assessmentsAssigned = filteredLogs.filter(
    (entry) => entry.activityType === "Question Paper"
  ).length;

  const totalActivity = lessonsCreated + quizzesConducted + assessmentsAssigned;
  const rangeLabel = getRangeLabel(timeRange);

  const stats = [
    {
      id: "t1",
      label: "Lessons\nCreated",
      value: lessonsCreated,
      sublabel: rangeLabel,
      iconType: "file-text",
      color: "rose",
    },
    {
      id: "t2",
      label: "Quizzes\nConducted",
      value: quizzesConducted,
      sublabel: rangeLabel,
      iconType: "book",
      color: "green",
    },
    {
      id: "t3",
      label: "Assessments\nAssigned",
      value: assessmentsAssigned,
      sublabel: rangeLabel,
      iconType: "check-circle",
      color: "yellow",
    },
  ];

  if (totalActivity < 3) {
    stats.push({
      id: "t4",
      label: "Low Engagement Note",
      value: "",
      sublabel: `Only ${totalActivity} activities logged ${rangeLabel}. Consider reviewing teaching methods.`,
      iconType: "alert-triangle",
      color: "rose",
      isNote: true,
    });
  } else {
    stats.push({
      id: "t4",
      label: "Performance\nStatus",
      value: "Good",
      sublabel: "Consistent activity",
      iconType: "award",
      color: "blue",
    });
  }

  const classCountMap = new Map();

  filteredLogs.forEach((entry) => {
    const classKey = `Class ${entry.class}`;
    classCountMap.set(classKey, (classCountMap.get(classKey) || 0) + 1);
  });

  const classData = [...classCountMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, value]) => ({ name, value }));

  const activities = filteredLogs.slice(0, 5).map((entry, index) => ({
    id: `act-${index}`,
    title: entry.activityType,
    subtitle: `${entry.subject} - Class ${entry.class} - ${formatDateForUi(entry.createdAt)}`,
    icon: "file-text",
  }));

  return {
    teacher: {
      id: teacherId,
      name: teacherName,
      subjects,
      grades,
      stats,
    },
    classData,
    activities,
  };
};

const getTeacherCsvReport = async (teacherId) => {
  const logs = await ActivityLog.find({ teacherId }).sort({ _id: 1 }).lean();

  if (logs.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Teacher "${teacherId}" was not found.`);
  }

  const headers = ["Date", "Teacher", "Class", "Subject", "Activity Type"];
  const rows = logs.map((entry) => [
    entry.sourceCreatedAt || formatDateForDataset(entry.createdAt),
    entry.teacherName,
    entry.class,
    entry.subject,
    entry.activityType,
  ]);

  return {
    teacherName: logs[0].teacherName,
    csv: buildCsv(headers, rows),
  };
};

module.exports = {
  getDashboardOverview,
  getAvailableFilters,
  getTeacherDirectory,
  getTeacherOverview,
  getTeacherCsvReport,
};
