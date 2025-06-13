"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { mockData } from "@/lib/utils";
import { Search, Users, Upload } from "lucide-react";
import useSWR from "swr";
import { Course, Enrollment, Result, Student, User } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

interface EnrollmentsResponse {
  data: Enrollment[];
}

interface ApiResponse {
  data: Student[];
}
export default function LecturerCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false);

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

  const {
    data: studentsData,
    error: studentError,
    isLoading
  } = useSWR<ApiResponse>("/api/getStudents", fetcher);

  // Get lecturer's courses (mock lecturer ID)
  const lecturerCourses = lecturerData?.data.courses.filter(
    (course) => course.lecturerId === "l1"
  );

  // Filter courses based on search term
  const filteredCourses = lecturerData?.data.courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get students enrolled in a course
  const getEnrolledStudents = (courseId: string) => {
    const enrollments = enrollmentsData?.data.filter(
      (e) => e.courseId === courseId
    );
    return enrollments
      ?.map((e) => {
        const student = studentsData?.data.find((s) => s.id === e.studentId);
        return student;
      })
      .filter(Boolean);
  };

  // Get results for a course
  const getCourseResults = (courseId: string) => {
    return lecturerData?.data.results.filter(
      (result) => result.courseId === courseId
    );
  };

  const handleViewStudents = (course: Course) => {
    setSelectedCourse(course);
    setIsStudentsDialogOpen(true);
  };

  if (error) return "An error has occurred.";
  if (lecturerDataIsLoading) return "Loading...";

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

          <div className="grid gap-6">
            {filteredCourses?.map((course) => {
              const enrolledStudents = getEnrolledStudents(course.id);
              const courseResults = getCourseResults(course.id);
              const resultsUploaded = courseResults?.length;
              const totalStudents = enrolledStudents?.length;

              return (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {course.code} - {course.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {course.department}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStudents(course)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          View Students
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Results
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {totalStudents}
                        </div>
                        <div className="text-sm text-blue-600">
                          Total Students
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {resultsUploaded}
                        </div>
                        <div className="text-sm text-green-600">
                          Results Uploaded
                        </div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {totalStudents ?? 0 - (resultsUploaded ?? 0)}
                        </div>
                        <div className="text-sm text-orange-600">
                          Pending Results
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredCourses?.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    No courses found matching your search.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* View Students Dialog */}
      <Dialog
        open={isStudentsDialogOpen}
        onOpenChange={setIsStudentsDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Students in {selectedCourse?.code}</DialogTitle>
            <DialogDescription>{selectedCourse?.title}</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg. Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Result Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getEnrolledStudents(selectedCourse.id)?.map(
                    (student: Student | undefined) => {
                      const hasResult = lecturerData?.data.results.some(
                        (result) =>
                          result.studentId === student?.user.id &&
                          result.courseId === selectedCourse.id
                      );
                      return (
                        <TableRow key={student?.user.id}>
                          <TableCell className="font-medium">
                            {student?.matricNo}
                          </TableCell>
                          <TableCell>
                            {student?.user.firstName} {student?.user.lastName}
                          </TableCell>
                          <TableCell>{student?.user.email}</TableCell>
                          <TableCell>{student?.department}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                hasResult
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {hasResult ? "Uploaded" : "Pending"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                  {getEnrolledStudents(selectedCourse.id)?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        No students enrolled in this course
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
