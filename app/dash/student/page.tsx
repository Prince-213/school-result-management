"use client";

import { useEffect, useState } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { BookOpen, BarChart3, Award, Download } from "lucide-react";
import useSWR from "swr";
import { Course, Student } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CoursesResponse {
  data: Course[];
}

export default function StudentDashboard() {
  const {
    data: studentData,
    isLoading: studentDataIsLoading,
    error: studentError
  } = useSWR<{
    data: Student;
  }>("/api/getStudent", fetcher);

  const {
    data: coursesData,
    isLoading: coursesDataIsLoading,
    error
  } = useSWR<{
    data: CoursesResponse;
  }>("/api/getCourses", fetcher);

  const studentId = studentData?.data.id;

  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageGrade: 0,
    gpa: 0
  });

  useEffect(() => {
    // Mock student ID - in real app, this would come from auth

    // Get student's enrollments
    const studentEnrollments = studentData?.data.enrollments;

    const studentResults = studentData?.data.results;
    // Get student's results
    /* const studentResults = mockData.results.filter(
      (r) => r.studentId === studentId
    ); */

    // Calculate average score
    const averageScore =
      studentResults?.length > 0
        ? studentResults.reduce((sum, result) => sum + result.score, 0) /
          studentResults.length
        : 0;

    /*  setStats({
      totalCourses: studentEnrollments.length,
      completedCourses: studentResults.length,
      averageGrade: Math.round(averageScore),
      gpa: ((averageScore / 100) * 4).toFixed(2), // Mock GPA calculation
    }) */
  }, []);

  // Get student's courses
  const getStudentCourses = () => {
    const enrollments = studentData?.data.enrollments;
    return enrollments
      ?.map((enrollment) => {
        const course = coursesData?.data.data.find(
          (c) => c.id === enrollment.courseId
        );
        const result = studentData?.data.results.find(
          (r) => r.studentId === studentId && r.courseId === enrollment.courseId
        );
        return { ...course, result };
      })
      .filter(Boolean);
  };

  // Get recent results
  const getRecentResults = () => {
    return studentData?.data.results
      .filter((r) => r.studentId === studentId)
      .slice(0, 3) // Get last 3 results
      .map((result) => {
        const course = coursesData?.data.data.find(
          (c) => c.id === result.courseId
        );
        return { ...result, course };
      });
  };

  if (error) return "An error has occurred.";
  if (studentDataIsLoading) return "Loading...";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {studentData?.data.user.firstName}!
              </h1>
              <p className="text-gray-600">
                Here's sdsafafjklsadjflkj your academic overview and recent
                results.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-gray-500">Enrolled courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedCourses}
                </div>
                <p className="text-xs text-gray-500">Results available</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Average Score
                </CardTitle>
                <Award className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageGrade}%</div>
                <p className="text-xs text-gray-500">Overall performance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">GPA</CardTitle>
                <Award className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.gpa}</div>
                <p className="text-xs text-gray-500">Grade Point Average</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="h-6 w-6" />
                  View Results
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  My Courses
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="h-6 w-6" />
                  Download Transcript
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Award className="h-6 w-6" />
                  Academic Records
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* My Courses */}
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getStudentCourses()
                    .slice(0, 4)
                    .map((course: any) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-sm">
                            {course.code}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {course.title}
                          </p>
                        </div>
                        <div className="text-right">
                          {course.result ? (
                            <div>
                              <div className="text-sm font-semibold text-green-600">
                                {course.result.grade}
                              </div>
                              <div className="text-xs text-gray-500">
                                {course.result.score}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-orange-600">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  <Button variant="outline" className="w-full">
                    View All Courses
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentResults().map((result: any) => (
                    <div
                      key={`${result.courseId}-${result.studentId}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-sm">
                          {result.course?.code}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {result.course?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {result.semester} Semester {result.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">
                          {result.grade}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.score}%
                        </div>
                      </div>
                    </div>
                  ))}
                  {getRecentResults().length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No results available yet
                    </div>
                  )}
                  <Button variant="outline" className="w-full">
                    View All Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Course Completion</span>
                  <span className="text-sm text-gray-500">
                    {stats.completedCourses}/{stats.totalCourses} courses
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalCourses > 0
                          ? (stats.completedCourses / stats.totalCourses) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">A+</div>
                    <div className="text-xs text-gray-500">1 course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">A</div>
                    <div className="text-xs text-gray-500">1 course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">B+</div>
                    <div className="text-xs text-gray-500">1 course</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">B</div>
                    <div className="text-xs text-gray-500">0 courses</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
