"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Search, BookOpen, User, Clock } from "lucide-react";
import { Course, Enrollment, Student } from "@/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EnrollmentsResponse {
  data: Enrollment[];
}

export default function StudentCoursesPage() {
  const {
    data: studentData,
    isLoading: studentDataIsLoading,
    error: studentError
  } = useSWR<{
    data: Student;
  }>("/api/getStudent", fetcher);

  const { data: enrollmentsData } = useSWR<EnrollmentsResponse>(
    "/api/getEnrollments",
    fetcher
  );

  const {
    data: coursesData,
    isLoading: coursesDataIsLoading,
    error
  } = useSWR<{
    data: Course[];
  }>("/api/getCourses", fetcher);

  const {
    data: lecturersData,
    isLoading: lecturersDataIsLoading,
    error: lecturersError
  } = useSWR<{
    data: Course[];
  }>("/api/getLecturers", fetcher);

  const [searchTerm, setSearchTerm] = useState("");

  // Mock student ID
  const studentId = studentData?.data.id;

  // Get student's enrolled courses
  const getStudentCourses = () => {
    const enrollments = enrollmentsData?.data.filter(
      (e) => e.studentId === studentId
    );
    return enrollments
      ?.map((enrollment) => {
        const course = coursesData?.data.find(
          (c) => c.id === enrollment.courseId
        );
        const lecturer = lecturersData?.data.find(
          (l) => l.id === course?.lecturerId
        );
        const result = studentData?.data.results.find(
          (r) => r.studentId === studentId && r.courseId === enrollment.courseId
        );
        return {
          ...course,
          lecturer,
          result,
          enrollmentId: enrollment.studentId + enrollment.courseId
        };
      })
      .filter(Boolean);
  };

  // Filter courses based on search term
  const filteredCourses = getStudentCourses()?.filter(
    (course: any) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return "An error has occurred.";
  if (studentDataIsLoading || coursesDataIsLoading) return "Loading...";

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          </div>

          <div className="flex items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses?.map((course: any) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.title}
                      </p>
                    </div>
                    <Badge variant={course.result ? "default" : "secondary"}>
                      {course.result ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{course.lecturer?.name || "TBA"}</span>
                    </div>
                    {course.result && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>
                          {course.result.semester} Semester {course.result.year}
                        </span>
                      </div>
                    )}
                  </div>

                  {course.result && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Result:</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            {course.result.grade}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.result.score}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    {course.result && (
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        View Result
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCourses?.length === 0 && (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      No courses found matching your search.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Course Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {getStudentCourses()?.length}
                  </div>
                  <div className="text-sm text-blue-600">Total Enrolled</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      getStudentCourses()?.filter(
                        (course: any) => course.result
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      getStudentCourses()?.filter(
                        (course: any) => !course.result
                      ).length
                    }
                  </div>
                  <div className="text-sm text-orange-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      getStudentCourses()?.filter(
                        (course: any) =>
                          course.result &&
                          ["A+", "A"].includes(course.result.grade)
                      ).length
                    }
                  </div>
                  <div className="text-sm text-purple-600">A Grades</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
