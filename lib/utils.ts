import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data for the application
export const mockData = {
  lecturers: [
    { id: "l1", name: "Dr. John Smith", email: "john.smith@example.com", department: "Computer Science" },
    { id: "l2", name: "Prof. Sarah Johnson", email: "sarah.johnson@example.com", department: "Mathematics" },
    { id: "l3", name: "Dr. Michael Brown", email: "michael.brown@example.com", department: "Physics" },
    { id: "l4", name: "Dr. Emily Davis", email: "emily.davis@example.com", department: "Engineering" },
    { id: "l5", name: "Prof. Robert Wilson", email: "robert.wilson@example.com", department: "Chemistry" },
  ],
  students: [
    { id: "s1", name: "Alice Cooper", email: "alice@example.com", regNo: "REG001", department: "Computer Science" },
    { id: "s2", name: "Bob Dylan", email: "bob@example.com", regNo: "REG002", department: "Mathematics" },
    { id: "s3", name: "Charlie Parker", email: "charlie@example.com", regNo: "REG003", department: "Physics" },
    { id: "s4", name: "Diana Ross", email: "diana@example.com", regNo: "REG004", department: "Engineering" },
    { id: "s5", name: "Edward Norton", email: "edward@example.com", regNo: "REG005", department: "Chemistry" },
    { id: "s6", name: "Fiona Apple", email: "fiona@example.com", regNo: "REG006", department: "Computer Science" },
    { id: "s7", name: "George Clooney", email: "george@example.com", regNo: "REG007", department: "Mathematics" },
    { id: "s8", name: "Hannah Montana", email: "hannah@example.com", regNo: "REG008", department: "Physics" },
  ],
  courses: [
    { id: "c1", code: "CS101", title: "Introduction to Programming", department: "Computer Science", lecturerId: "l1" },
    { id: "c2", code: "MATH201", title: "Calculus II", department: "Mathematics", lecturerId: "l2" },
    { id: "c3", code: "PHY101", title: "Physics I", department: "Physics", lecturerId: "l3" },
    { id: "c4", code: "ENG202", title: "Engineering Mechanics", department: "Engineering", lecturerId: "l4" },
    { id: "c5", code: "CHEM101", title: "General Chemistry", department: "Chemistry", lecturerId: "l5" },
    { id: "c6", code: "CS202", title: "Data Structures", department: "Computer Science", lecturerId: "l1" },
    { id: "c7", code: "MATH101", title: "Algebra", department: "Mathematics", lecturerId: "l2" },
    { id: "c8", code: "PHY202", title: "Electromagnetism", department: "Physics", lecturerId: "l3" },
  ],
  enrollments: [
    { studentId: "s1", courseId: "c1" },
    { studentId: "s1", courseId: "c2" },
    { studentId: "s1", courseId: "c3" },
    { studentId: "s2", courseId: "c1" },
    { studentId: "s2", courseId: "c4" },
    { studentId: "s3", courseId: "c2" },
    { studentId: "s3", courseId: "c5" },
    { studentId: "s4", courseId: "c3" },
    { studentId: "s4", courseId: "c4" },
    { studentId: "s5", courseId: "c5" },
    { studentId: "s5", courseId: "c1" },
    { studentId: "s6", courseId: "c6" },
    { studentId: "s7", courseId: "c7" },
    { studentId: "s8", courseId: "c8" },
  ],
  results: [
    { studentId: "s1", courseId: "c1", score: 85, grade: "A", semester: "1st", year: "2023" },
    { studentId: "s1", courseId: "c2", score: 72, grade: "B", semester: "1st", year: "2023" },
    { studentId: "s1", courseId: "c3", score: 78, grade: "B+", semester: "2nd", year: "2023" },
    { studentId: "s2", courseId: "c1", score: 90, grade: "A+", semester: "1st", year: "2023" },
    { studentId: "s2", courseId: "c4", score: 65, grade: "C+", semester: "2nd", year: "2023" },
    { studentId: "s3", courseId: "c2", score: 88, grade: "A", semester: "1st", year: "2023" },
    { studentId: "s3", courseId: "c5", score: 76, grade: "B", semester: "2nd", year: "2023" },
    { studentId: "s4", courseId: "c3", score: 82, grade: "A-", semester: "1st", year: "2023" },
    { studentId: "s4", courseId: "c4", score: 79, grade: "B+", semester: "2nd", year: "2023" },
    { studentId: "s5", courseId: "c5", score: 91, grade: "A+", semester: "1st", year: "2023" },
    { studentId: "s5", courseId: "c1", score: 84, grade: "A-", semester: "2nd", year: "2023" },
  ],
}
