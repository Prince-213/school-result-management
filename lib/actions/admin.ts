"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db/prisma";
import { Semester } from "@/types";
import { cookies } from "next/headers";
import { getBaseUrl } from "../utils";

export async function addLecturer(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const firstName = formData.get("firstname")?.toString() ?? "";
  const lastName = formData.get("lastname")?.toString() ?? "";
  const staffId = formData.get("staffid")?.toString() ?? "";
  const department = formData.get("department")?.toString() ?? "";

  try {
    const data = await prisma.user.create({
      data: {
        email,
        password, // Remember to hash this in production!
        firstName,
        lastName,
        role: "LECTURER",
        lecturer: {
          create: {
            staffId,
            department,
          },
        },
      },
      include: {
        lecturer: true,
      },
    });

    if (data) {
      try {
        const response = await fetch(`${getBaseUrl()}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: `${firstName} ${lastName}`,
            role: "LECTURER",
            message:
              "Welcome to the School Result Management System! You have been successfully added as a lecturer. You can now manage your courses, upload results, and communicate with students. If you have any questions or need assistance, please contact the school administration.",
          }),
        });

        if (response.ok) {
          console.log("Email sent successfully!");

          return {
            message: "success",
          };
        } else {
          const errorDetails = await response.json();
          console.error("Error sending email:", errorDetails.message);
          return {
            message: "wrong",
          };
        }
      } catch (error) {
        console.error("There was a problem sending the email:", error);
        return {
          message: "wrong",
        };
      }
    }

    revalidatePath("/dash/admin/lecturers");

    return { message: "success" };
  } catch (err) {
    console.log(err);
    return { message: "unsuccess" };
  }
}

// Usage:
// await addLecturer('lecturer@school.com', 'secure123', 'John', 'Doe', 'STAFF123', 'Computer Science')

export async function addStudent(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const firstName = formData.get("firstname")?.toString() ?? "";
  const lastName = formData.get("lastname")?.toString() ?? "";
  const matricNo = formData.get("matricNo")?.toString() ?? "";
  const department = formData.get("department")?.toString() ?? "";
  const level = parseInt(formData.get("level")?.toString() ?? "");
  try {
    const data = await prisma.user.create({
      data: {
        email,
        password, // Remember to hash this in production!
        firstName,
        lastName,
        role: "STUDENT",
        student: {
          create: {
            matricNo,
            department,
            level,
          },
        },
      },
      include: {
        student: true,
      },
    });

    if (data) {
      try {
        const response = await fetch(`${getBaseUrl()}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: `${firstName} ${lastName}`,
            role: "STUDENT",
            message:
              "Welcome to the School Result Management System! You have been successfully added as a student. You can now view your results, check course materials, and communicate with lecturers. If you have any questions or need assistance, please contact the school administration.",
          }),
        });

        if (response.ok) {
          console.log("Email sent successfully!");

          return {
            message: "success",
          };
        } else {
          const errorDetails = await response.json();
          console.error("Error sending email:", errorDetails.message);
          return {
            message: "wrong",
          };
        }
      } catch (error) {
        console.error("There was a problem sending the email:", error);
        return {
          message: "wrong",
        };
      }
    }

    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "unsuccess" };
  }
}

// Usage:
// await addStudent('student@school.com', 'secure123', 'Jane', 'Smith', 'MAT123', 'Computer Science', 200)

export async function addCourse(prevState: any, formData: FormData) {
  const code = formData.get("code")?.toString() ?? "";
  const title = formData.get("title")?.toString() ?? "";
  const creditUnits = parseInt(
    formData.get("creditUnits")?.toString() ?? "0",
    10
  );
  const level = parseInt(formData.get("level")?.toString() ?? "0", 10);
  const semester = (formData.get("semester")?.toString() ?? "") as
    | "FIRST"
    | "SECOND";
  const description = formData.get("description")?.toString() ?? "";
  const department = formData.get("department")?.toString() ?? "";

  try {
    await prisma.course.create({
      data: {
        code,
        title,
        description,
        creditUnits,
        level,
        semester,
        department,
      },
    });

    return { message: "success" };
  } catch (error) {
    return { message: "unsuccess" };
  }
}

// Usage:
// await addCourse('CSC101', 'Introduction to Computer Science', 3, 100, 'FIRST', 'Basic computer science concepts')

export async function assignCourseToLecturer(data: {
  courseId: string;
  lecturerId: string;
}) {
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: data.courseId },
      data: {
        lecturerId: data.lecturerId || null, // Set to null if empty string
      },
      include: {
        lecturer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (updatedCourse) {
      try {
        const response = await fetch(`${getBaseUrl()}/api/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: updatedCourse.lecturer?.user.email,
            name: `${updatedCourse.lecturer?.user.firstName} ${updatedCourse.lecturer?.user.lastName}`,
            role: "LECTURER",
            message: "A new course has been assigned to you.",
          }),
        });

        if (response.ok) {
          console.log("Email sent successfully!");

          return {
            message: "success",
          };
        } else {
          const errorDetails = await response.json();
          console.error("Error sending email:", errorDetails.message);
          return {
            message: "wrong",
          };
        }
      } catch (error) {
        console.error("There was a problem sending the email:", error);
        return {
          message: "wrong",
        };
      }
    }

    return updatedCourse;
  } catch (error) {
    console.error("Error assigning lecturer:", error);
    throw new Error("Failed to assign lecturer");
  }
}

// Usage:
// await assignCourseToLecturer('course-id-123', 'lecturer-id-456')

export async function enrollStudentsInCourse(data: {
  studentId: string;
  courseId: string;
  session: string;
  semester: "FIRST" | "SECOND";
}) {
  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        session: data.session,
        semester: data.semester,
      },
      include: {
        student: true,

        course: true,
      },
    });

    return enrollment;
  } catch (error) {
    console.error("Error enrolling student:", error);
    throw new Error("Failed to enroll student");
  }
}

export async function removeStudentFromCourse(data: {
  studentId: string;
  courseId: string;
}) {
  try {
    const enrollment = await prisma.enrollment.deleteMany({
      where: {
        studentId: data.studentId,
        courseId: data.courseId,
      },
    });
    return enrollment;
  } catch (error) {
    console.error("Error removing student from course:", error);
    throw new Error("Failed to remove student from course");
  }
}

export async function uploadStudentResult(
  enrollmentId: string,
  score: number,
  lecturerId: string | undefined
) {
  const cookieStore = await cookies();
  const id = cookieStore.get("id")?.value;

  lecturerId = id ?? "";

  console.log(lecturerId);
  console.log(enrollmentId);

  // Calculate grade based on score (customize this as needed)
  const calculateGrade = (score: number): string => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    return "F";
  };

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true, student: true },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const result = await prisma.result.upsert({
    where: { enrollmentId },
    create: {
      enrollmentId,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      lecturerId,
      score,
      grade: calculateGrade(score),
      published: false,
    },
    update: {
      score,
      grade: calculateGrade(score),
      updatedAt: new Date(),
    },
  });

  if (result) {
    try {
      // Get student user info
      const studentUser = await prisma.user.findUnique({
        where: { id: enrollment.student.userId },
      });
      const response = await fetch(`${getBaseUrl()}/api/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: studentUser?.email,
          name: `${studentUser?.firstName ?? "Student"} ${
            studentUser?.lastName ?? ""
          }`,
          role: "STUDENT",
          message: `Dear ${
            studentUser?.firstName ?? "Student"
          }, your result for ${
            enrollment.course.title
          } has been uploaded. Your score: ${score}, grade: ${calculateGrade(
            score
          )}. Please log in to the portal to view details.`,
        }),
      });

      if (response.ok) {
        console.log("Email sent successfully!");
        return {
          message: "success",
        };
      } else {
        const errorDetails = await response.json();
        console.error("Error sending email:", errorDetails.message);
        return {
          message: "wrong",
        };
      }
    } catch (error) {
      console.error("There was a problem sending the email:", error);
      return {
        message: "wrong",
      };
    }
  }

  return result;
}

// Usage:
// await uploadStudentResult('enrollment-id-123', 85, 'lecturer-id-456')
