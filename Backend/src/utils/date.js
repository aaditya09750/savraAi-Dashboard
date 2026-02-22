const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ORDERED_DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const parseDatasetDate = (value) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string") {
    return new Date(value);
  }

  const [datePart, timePart = "00:00:00"] = value.trim().split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second || 0, 0);
};

const buildTimeRangeQuery = (latestDate, timeRange = "week") => {
  if (!latestDate) {
    return {};
  }

  const { start, end } = getRangeBounds(latestDate, timeRange);
  return { $gte: start, $lt: end };
};

const getRangeBounds = (latestDate, timeRange = "week") => {
  const latest = parseDatasetDate(latestDate);

  if (timeRange === "month") {
    const start = new Date(latest.getFullYear(), latest.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(latest.getFullYear(), latest.getMonth() + 1, 1, 0, 0, 0, 0);
    return { start, end };
  }

  if (timeRange === "year") {
    const start = new Date(latest.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = new Date(latest.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
    return { start, end };
  }

  const start = new Date(latest);
  start.setDate(start.getDate() - 7);
  const end = new Date(latest.getTime() + 1000);
  return { start, end };
};

const getPreviousRangeBounds = (latestDate, timeRange = "week") => {
  const current = getRangeBounds(latestDate, timeRange);
  const durationMs = current.end.getTime() - current.start.getTime();
  const end = new Date(current.start);
  const start = new Date(end.getTime() - durationMs);
  return { start, end };
};

const getRangeLabel = (timeRange = "week") => {
  if (timeRange === "month") {
    return "This month";
  }
  if (timeRange === "year") {
    return "This year";
  }
  return "This week";
};

const getPreviousRangeLabel = (timeRange = "week") => {
  if (timeRange === "month") {
    return "last month";
  }
  if (timeRange === "year") {
    return "last year";
  }
  return "last week";
};

const formatDateForUi = (date) => new Intl.DateTimeFormat("en-US").format(new Date(date));

const formatDateForDataset = (date) => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hour = String(value.getHours()).padStart(2, "0");
  const minute = String(value.getMinutes()).padStart(2, "0");
  const second = String(value.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

module.exports = {
  DAY_LABELS,
  ORDERED_DAY_LABELS,
  parseDatasetDate,
  buildTimeRangeQuery,
  getRangeBounds,
  getPreviousRangeBounds,
  getRangeLabel,
  getPreviousRangeLabel,
  formatDateForUi,
  formatDateForDataset,
};
