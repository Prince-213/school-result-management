"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockData } from "@/lib/utils";
import { BookOpen, Users, Upload, BarChart3 } from "lucide-react";
import useSWR from "swr";
import { Lecturer } from "@/lib/generated/prisma";
import { Course, Enrollment, Result, User } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EnrollmentsResponse {
  data: Enrollment[];
}

export default function LecturerDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingResults: 0
  });

  useEffect(() => {
    // Get lecturer's courses (in a real app, this would filter by lecturer ID)
    const lecturerCourses = mockData.courses.filter(
      (course) => course.lecturerId === "l1"
    ); // Mock lecturer ID

    // Get total students across all lecturer's courses
    const totalStudents = lecturerCourses.reduce((total, course) => {
      const enrollments = mockData.enrollments.filter(
        (e) => e.courseId === course.id
      );
      return total + enrollments.length;
    }, 0);

    setStats({
      totalCourses: lecturerCourses.length,
      totalStudents,
      pendingResults: 5 // Mock pending results
    });
  }, []);

  interface Lecturer {
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

  // Get lecturer's courses
  const getLecturerCourses = () => {
    return mockData.courses.filter((course) => course.lecturerId === "l1"); // Mock lecturer ID
  };

  const {
    data: lecturerData,
    isLoading: lecturerDataIsLoading,
    error
  } = useSWR<{
    data: Lecturer;
  }>("/api/getLecturer", fetcher);

  const { data: enrollmentsData } = useSWR<EnrollmentsResponse>(
    "/api/getEnrollments",
    fetcher
  );

  console.log(lecturerData);

  if (error) return "An error has occurred.";
  if (lecturerDataIsLoading) return "Loading...";

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {lecturerData?.data.user.firstName}!
              </h1>
              <p className="text-gray-600">
                Here's an overview of your courses and students.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  My Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lecturerData?.data.courses.length}
                </div>
                <p className="text-xs text-gray-500">Courses assigned to you</p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lecturerData?.data.}</div>
                <p className="text-xs text-gray-500">
                  Students in your courses
                </p>
              </CardContent>
            </Card> */}
            {/*  <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Pending Results
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingResults}</div>
                <p className="text-xs text-gray-500">Results to be uploaded</p>
              </CardContent>
            </Card> */}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button className="h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                  <Upload className="h-6 w-6" />
                  Upload Results
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  View Courses
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  View Students
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lecturerData?.data.courses.map((course) => {
                  const enrollments = enrollmentsData?.data.filter(
                    (e) => e.courseId === course.id
                  );
                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">
                          {course.code} - {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {course.department}
                        </p>
                        <p className="text-xs text-gray-500">
                          {enrollments?.length} students enrolled
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Students
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Upload Results
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {lecturerData?.data.courses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No courses assigned yet. Contact your administrator.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <Upload className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Results Uploaded</p>
                    <p className="text-xs text-gray-500">
                      CS101 - Introduction to Programming results uploaded
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    2 hours ago
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Student Enrolled</p>
                    <p className="text-xs text-gray-500">
                      Alice Cooper enrolled in CS202 - Data Structures
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">1 day ago</div>
                </div>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Course Assignment</p>
                    <p className="text-xs text-gray-500">
                      You were assigned to teach CS202 - Data Structures
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    3 days ago
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
