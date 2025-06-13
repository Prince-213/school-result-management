"use client";

import type React from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { mockData } from "@/lib/utils";
import { Search, FileSpreadsheet, Plus } from "lucide-react";
import { Enrollment, Lecturer, Student } from "@/types";
import useSWR, { mutate } from "swr";
import { uploadStudentResult } from "@/lib/actions/admin";
import { toast } from "sonner";

interface EnrollmentsResponse {
  data: Enrollment[];
}

interface ApiResponse {
  data: Student[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LecturerResultsPage() {
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

  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isExcelUploadDialogOpen, setIsExcelUploadDialogOpen] = useState(false);
  const [isAddResultDialogOpen, setIsAddResultDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [enrollment, setEnrollment] = useState("");
  const [score, setScore] = useState(0);
  const [newResult, setNewResult] = useState({
    studentRegNo: "",
    score: "",
    grade: "",
    semester: "",
    year: ""
  });

  // Get lecturer's courses
  const lecturerCourses = lecturerData?.data.courses;

  // Get students for selected course
  const getStudentsForCourse = (courseId: string) => {
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

  console.log("students for course");
  console.log(getStudentsForCourse(selectedCourse));

  // Filter students based on search
  const filteredStudents = selectedCourse
    ? getStudentsForCourse(selectedCourse)?.filter(
        (student: any) =>
          student.user.firstName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Mock Excel file upload handler
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate file processing
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Mock parsed Excel data
            setExcelData([
              { regNo: "REG001", score: 85, grade: "A" },
              { regNo: "REG002", score: 78, grade: "B+" },
              { regNo: "REG003", score: 92, grade: "A+" },
              { regNo: "REG004", score: 67, grade: "C+" },
              { regNo: "REG005", score: 74, grade: "B" }
            ]);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleSubmitExcelResults = () => {
    // In a real app, this would submit to the backend
    console.log("Submitting Excel results:", excelData);
    setExcelData([]);
    setIsExcelUploadDialogOpen(false);
    setUploadProgress(0);
  };

  const handleAddIndividualResult = () => {
    // In a real app, this would submit to the backend
    console.log("Adding individual result:", newResult);
    setNewResult({
      studentRegNo: "",
      score: "",
      grade: "",
      semester: "",
      year: ""
    });
    setIsAddResultDialogOpen(false);
  };

  const handleAddScore = (id: string | undefined) => {
    setEnrollment(id ?? "");
    setIsResultDialogOpen(true);
  };

  const handleAddTheScore = async () => {
    try {
      await uploadStudentResult(enrollment, score, "");
      toast.success("Score Added");
      mutate("/api/getEnrollments");
      mutate("/api/getLecturers");
    } catch (error) {
      toast.error("Error adding Score");
    }
  };

    if (error) return "An error has occurred.";
    if (lecturerDataIsLoading) return "Loading...";

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Upload Results
            </h1>
            <div className="flex gap-2">
              <Dialog
                open={isAddResultDialogOpen}
                onOpenChange={setIsAddResultDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Individual Result
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Dialog
                open={isExcelUploadDialogOpen}
                onOpenChange={setIsExcelUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Upload Excel
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturerCourses?.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="search">Search Students</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search by name or reg number..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          {selectedCourse && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Students in{" "}
                  {lecturerCourses?.find((c) => c.id === selectedCourse)?.code}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Score</TableHead>
                      <TableHead>Current Grade</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getStudentsForCourse(selectedCourse)?.map((student) => {
                      const existingResult = enrollmentsData?.data.find(
                        (result) =>
                          result.studentId === student?.id &&
                          result.courseId === selectedCourse
                      );

                      const scoreValue = lecturerData?.data.results?.find(
                        (result) =>
                          result.studentId === student?.id &&
                          result.courseId === selectedCourse &&
                          result.enrollmentId == existingResult?.id
                      );

                      console.log("existing is");
                      console.log(existingResult);
                      return (
                        <TableRow key={student?.userId}>
                          <TableCell className="font-medium">
                            {student?.matricNo}
                          </TableCell>
                          <TableCell>{student?.user.firstName}</TableCell>
                          <TableCell>{student?.department}</TableCell>
                          <TableCell>{scoreValue?.score}</TableCell>
                          <TableCell>{scoreValue?.grade} </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleAddScore(existingResult?.id)}
                              size="sm"
                              variant="outline"
                            >
                              {scoreValue?.grade ? "Update" : "Add"} Result
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredStudents?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          {selectedCourse
                            ? "No students found"
                            : "Select a course to view students"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Excel Upload Dialog */}
      <Dialog
        open={isExcelUploadDialogOpen}
        onOpenChange={setIsExcelUploadDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Results via Excel</DialogTitle>
            <DialogDescription>
              Upload an Excel file containing student registration numbers and
              scores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!isUploading && excelData.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="excel-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-purple-600 hover:text-purple-500">
                      Click to upload Excel file
                    </span>
                    <Input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleExcelUpload}
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Excel files only (.xlsx, .xls)
                  </p>
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {excelData.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Preview Results</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {excelData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.regNo}</TableCell>
                        <TableCell>{row.score}</TableCell>
                        <TableCell>{row.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExcelUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            {excelData.length > 0 && (
              <Button
                onClick={handleSubmitExcelResults}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Submit Results
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Individual Result Dialog */}
      <Dialog
        open={isAddResultDialogOpen}
        onOpenChange={setIsAddResultDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Individual Result</DialogTitle>
            <DialogDescription>
              Enter result details for a specific student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student-regno">Student Registration Number</Label>
              <Input
                id="student-regno"
                value={newResult.studentRegNo}
                onChange={(e) =>
                  setNewResult({ ...newResult, studentRegNo: e.target.value })
                }
                placeholder="e.g., REG001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={newResult.score}
                onChange={(e) =>
                  setNewResult({ ...newResult, score: e.target.value })
                }
                placeholder="e.g., 85"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={newResult.grade}
                onChange={(e) =>
                  setNewResult({ ...newResult, grade: e.target.value })
                }
                placeholder="e.g., A"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={newResult.semester}
                  onValueChange={(value) =>
                    setNewResult({ ...newResult, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Semester</SelectItem>
                    <SelectItem value="2nd">2nd Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Academic Year</Label>
                <Input
                  id="year"
                  value={newResult.year}
                  onChange={(e) =>
                    setNewResult({ ...newResult, year: e.target.value })
                  }
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddResultDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddIndividualResult}>Add Result</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Result Result {enrollment}</DialogTitle>
            <DialogDescription>
              Enter result details for a specific student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                placeholder="e.g., 85"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResultDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTheScore}>Add Result</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
