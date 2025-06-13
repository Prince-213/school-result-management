"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/utils";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Course, Enrollment, Lecturer, Student } from "@/types";
import useSWR, { mutate } from "swr";

interface ApiResponse {
  data: Course[];
}

interface StudentsResponse {
  data: Student[];
}

interface EnrollmentsResponse {
  data: Enrollment[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  // Data fetching
  const {
    data: coursesData,
    error,
    isLoading: coursesDataIsLoading
  } = useSWR<ApiResponse>("/api/getCourses", fetcher);
  const { data: studentsData, isLoading: studentsDataIsLoading } =
    useSWR<StudentsResponse>("/api/getStudents", fetcher);
  const { data: enrollmentsData } = useSWR<EnrollmentsResponse>(
    "/api/getEnrollments",
    fetcher
  );
  const { data: lecturersData, isLoading: lecturerDataIsLoading } = useSWR<{
    data: Lecturer[];
  }>("/api/getLecturers", fetcher);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0
  });

  useEffect(() => {
    // In a real app, this would be an API call
    setStats({
      totalStudents: mockData.students.length,
      totalLecturers: mockData.lecturers.length,
      totalCourses: mockData.courses.length
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className=" md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentsDataIsLoading ? (
                    <div className=" w-10 h-4 bg-gray-200 animate-pulse rounded-md "></div>
                  ) : (
                    <h2>{studentsData?.data.length}</h2>
                  )}
                </div>
                <p className="text-xs text-gray-500">Registered students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Lecturers
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {lecturerDataIsLoading ? (
                    <div className=" w-10 h-4 bg-gray-200 animate-pulse rounded-md "></div>
                  ) : (
                    <h2>{lecturersData?.data.length}</h2>
                  )}
                </div>
                <p className="text-xs text-gray-500">Active lecturers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {coursesDataIsLoading ? (
                    <div className=" w-10 h-4 bg-gray-200 animate-pulse rounded-md "></div>
                  ) : (
                    <h2>{coursesData?.data.length}</h2>
                  )}
                </div>
                <p className="text-xs text-gray-500">Available courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      New Student Registered
                    </p>
                    <p className="text-xs text-gray-500">
                      Hannah Montana (REG008) was added to the system
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    2 hours ago
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Course Created</p>
                    <p className="text-xs text-gray-500">
                      CS202: Data Structures was added to the curriculum
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    5 hours ago
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-md border p-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lecturer Assignment</p>
                    <p className="text-xs text-gray-500">
                      Dr. John Smith was assigned to CS101
                    </p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
