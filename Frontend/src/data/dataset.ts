export interface RawActivity {
  teacherId: string;
  teacherName: string;
  grade: string;
  subject: string;
  activityType: 'Quiz' | 'Question Paper' | 'Lesson Plan';
  createdAt: string;
}

export const rawActivityLog: RawActivity[] = [
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '10', subject: 'Social Studies', activityType: 'Quiz', createdAt: '2026-02-12 19:07:41' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '7', subject: 'English', activityType: 'Question Paper', createdAt: '2026-02-13 15:31:51' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '10', subject: 'Social Studies', activityType: 'Lesson Plan', createdAt: '2026-02-11 19:15:55' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '7', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-17 20:35:33' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '9', subject: 'Social Studies', activityType: 'Question Paper', createdAt: '2026-02-15 16:51:32' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Quiz', createdAt: '2026-02-14 15:22:29' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Quiz', createdAt: '2026-02-12 12:26:22' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '9', subject: 'Science', activityType: 'Quiz', createdAt: '2026-02-17 09:21:32' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '9', subject: 'Science', activityType: 'Question Paper', createdAt: '2026-02-12 11:38:24' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Question Paper', createdAt: '2026-02-17 19:07:47' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-11 17:53:57' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-16 11:26:52' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '7', subject: 'English', activityType: 'Lesson Plan', createdAt: '2026-02-16 15:41:50' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-11 17:54:16' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-17 19:19:56' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '9', subject: 'Social Studies', activityType: 'Quiz', createdAt: '2026-02-16 19:12:33' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-13 09:16:06' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Quiz', createdAt: '2026-02-15 11:36:03' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '9', subject: 'Social Studies', activityType: 'Lesson Plan', createdAt: '2026-02-11 13:06:29' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Quiz', createdAt: '2026-02-15 13:31:42' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-16 11:44:31' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-18 18:45:43' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-12 19:19:44' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '8', subject: 'Science', activityType: 'Quiz', createdAt: '2026-02-14 13:57:07' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '8', subject: 'Science', activityType: 'Question Paper', createdAt: '2026-02-12 18:01:59' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '7', subject: 'Mathematics', activityType: 'Question Paper', createdAt: '2026-02-14 10:36:09' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-18 16:32:47' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '10', subject: 'Social Studies', activityType: 'Quiz', createdAt: '2026-02-15 15:59:00' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '8', subject: 'Science', activityType: 'Lesson Plan', createdAt: '2026-02-15 13:31:36' },
  { teacherId: 'T004', teacherName: 'Vikas Nair', grade: '9', subject: 'Social Studies', activityType: 'Lesson Plan', createdAt: '2026-02-15 16:32:23' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Question Paper', createdAt: '2026-02-18 09:12:05' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '9', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-18 16:26:04' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '9', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-16 17:14:47' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Question Paper', createdAt: '2026-02-12 17:47:58' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Quiz', createdAt: '2026-02-18 14:05:20' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '8', subject: 'Science', activityType: 'Quiz', createdAt: '2026-02-14 09:54:01' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '9', subject: 'Science', activityType: 'Lesson Plan', createdAt: '2026-02-12 18:27:09' },
  { teacherId: 'T001', teacherName: 'Anita Sharma', grade: '8', subject: 'Mathematics', activityType: 'Quiz', createdAt: '2026-02-14 15:43:38' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '8', subject: 'Science', activityType: 'Lesson Plan', createdAt: '2026-02-18 15:48:08' },
  { teacherId: 'T002', teacherName: 'Rahul Verma', grade: '9', subject: 'Science', activityType: 'Lesson Plan', createdAt: '2026-02-16 13:31:34' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Lesson Plan', createdAt: '2026-02-14 19:49:54' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '10', subject: 'Mathematics', activityType: 'Quiz', createdAt: '2026-02-14 11:55:18' },
  { teacherId: 'T003', teacherName: 'Pooja Mehta', grade: '6', subject: 'English', activityType: 'Lesson Plan', createdAt: '2026-02-16 15:33:27' },
  { teacherId: 'T005', teacherName: 'Neha Kapoor', grade: '9', subject: 'Mathematics', activityType: 'Lesson Plan', createdAt: '2026-02-18 11:51:37' }
];
