// types/prisma.d.ts

export enum UserRole {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  ADMIN = "ADMIN"
}

export enum Semester {
  FIRST = "FIRST",
  SECOND = "SECOND"
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  student?: Student;
  lecturer?: Lecturer;
}

export interface Student {
  id: string;
  userId: string;
  user: User;
  matricNo: string;
  department: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  enrollments: Enrollment[];
  results: Result[];
}

export interface Lecturer {
  id: string;
  userId: string;
  user: User;
  staffId: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  courses: Course[];
  results: Result[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  department: string;
  creditUnits: number;
  level: number;
  semester: Semester;
  createdAt: Date;
  updatedAt: Date;
  lecturerId?: string;
  lecturer?: Lecturer;
  enrollments: Enrollment[];
  results: Result[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  session: string;
  semester: Semester;
  createdAt: Date;
  student: Student;
  course: Course;
  result?: Result;
}

export interface Result {
  id: string;
  enrollmentId: string;
  enrollment: Enrollment;
  courseId: string;
  studentId: string;
  lecturerId: string;
  score: number;
  grade: string;
  remarks?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  course: Course;
  student: Student;
  lecturer: Lecturer;
}

// Additional utility types that might be useful
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface CreateStudentInput
  extends Omit<
    Student,
    "id" | "createdAt" | "updatedAt" | "user" | "enrollments" | "results"
  > {
  userId: string;
}

export interface CreateLecturerInput
  extends Omit<
    Lecturer,
    "id" | "createdAt" | "updatedAt" | "user" | "courses" | "results"
  > {
  userId: string;
}

export interface CreateCourseInput
  extends Omit<
    Course,
    "id" | "createdAt" | "updatedAt" | "lecturer" | "enrollments" | "results"
  > {
  lecturerId?: string;
}

export interface SimplifiedLecturer {
  id: string;
  name: string; // Combined first + last name
  email: string;
  staffId: string;
  department: string;
  coursesCount: number;
}

export interface SimplifiedCourse {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  lecturerName?: string;
}
