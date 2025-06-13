"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { Download, Search, Filter, FileText, Printer } from "lucide-react";

import { Course, Enrollment, Student } from "@/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface EnrollmentsResponse {
  data: Enrollment[];
}
export default function StudentResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

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

  // Mock student ID
  const studentId = studentData?.data.id;

  // Get student's results with course information
  const getStudentResults = () => {
    return studentData?.data.results
      .filter((result) => result.studentId === studentId)
      .map((result) => {
        const course = coursesData?.data.find((c) => c.id === result.courseId);
        return { ...result, course };
      });
  };

  // Get unique semesters and years

  // Calculate GPA for selected results
  const calculateGPA = (results: any[]) => {
    if (results.length === 0) return 0;
    const totalPoints = results.reduce((sum, result) => {
      // Simple GPA calculation (A+=4, A=3.7, B+=3.3, B=3, etc.)
      const gradePoints: { [key: string]: number } = {
        "A+": 4.0,
        A: 3.7,
        "A-": 3.3,
        "B+": 3.0,
        B: 2.7,
        "B-": 2.3,
        "C+": 2.0,
        C: 1.7,
        "C-": 1.3,
        "D+": 1.0,
        D: 0.7,
        F: 0.0
      };
      return sum + (gradePoints[result.grade] || 0);
    }, 0);
    return (totalPoints / results.length).toFixed(2);
  };

  const handleCourseSelection = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses([...selectedCourses, courseId]);
    } else {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCourseIds = getStudentResults()?.map(
        (result) => result.courseId
      );
      setSelectedCourses(allCourseIds ?? []);
    } else {
      setSelectedCourses([]);
    }
  };

  const handlePrintResults = () => {
    window.print();
  };

  const handleDownloadTranscript = () => {
    // In a real app, this would generate and download a PDF
    alert("Transcript download would start here");
  };

  const filteredResults = getStudentResults();
  const selectedResults = filteredResults?.filter((result) =>
    selectedCourses.includes(result.courseId)
  );

  if (error) return "An error has occurred.";
  if (studentDataIsLoading || coursesDataIsLoading) return "Loading...";

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">My Results</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintResults}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleDownloadTranscript}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Transcript
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="search">Search Courses</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search courses..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {/*  <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {getUniqueSemesters().map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester} Semester
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
                {/* <div>
                  <Label htmlFor="year">Academic Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {getUniqueYears().map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          {selectedCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Results Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedResults?.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      Selected Courses
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedResults?.length > 0
                        ? Math.round(
                            selectedResults?.reduce(
                              (sum, r) => sum + r.score,
                              0
                            ) / selectedResults?.length
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-green-600">Average Score</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculateGPA(selectedResults)}
                    </div>
                    <div className="text-sm text-purple-600">GPA</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {
                        selectedResults?.filter((r) =>
                          ["A+", "A", "A-"].includes(r.grade)
                        ).length
                      }
                    </div>
                    <div className="text-sm text-orange-600">A Grades</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Academic Results</CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      filteredResults?.length > 0 &&
                      selectedCourses.length === filteredResults?.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    Select All
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults?.map((result) => (
                    <TableRow key={`${result.courseId}-${result.studentId}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCourses.includes(result.courseId)}
                          onCheckedChange={(checked) =>
                            handleCourseSelection(
                              result.courseId,
                              checked as boolean
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {result.course?.code}
                      </TableCell>
                      <TableCell>{result.course?.title}</TableCell>
                      <TableCell>{result.score}%</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ["A+", "A"].includes(result.grade)
                              ? "bg-green-100 text-green-800"
                              : ["A-", "B+", "B"].includes(result.grade)
                              ? "bg-blue-100 text-blue-800"
                              : ["B-", "C+", "C"].includes(result.grade)
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.grade}
                        </span>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredResults?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No results found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
