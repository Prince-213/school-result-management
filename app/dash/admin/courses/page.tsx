"use client";

import { useActionState, useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { mockData } from "@/lib/utils";
import { Edit, Plus, School2, Search, Trash2, Users } from "lucide-react";
import {
  addCourse,
  assignCourseToLecturer,
  enrollStudentsInCourse,
  removeStudentFromCourse
} from "@/lib/actions/admin";
import { toast } from "sonner";

import useSWR, { mutate } from "swr";

import { Course, Student, Enrollment, Lecturer } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface ApiResponse {
  data: Course[];
}

interface StudentsResponse {
  data: Student[];
}

interface EnrollmentsResponse {
  data: Enrollment[];
}

interface SimplifiedCourse {
  id: string;
  code: string;
  title: string;
  department: string;
  lecturerId: string;
  enrolledStudents: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const initialState = {
  message: ""
};

export default function CoursesPage() {
  // Data fetching
  const {
    data: coursesData,
    error,
    isLoading
  } = useSWR<ApiResponse>("/api/getCourses", fetcher);
  const { data: studentsData } = useSWR<StudentsResponse>(
    "/api/getStudents",
    fetcher
  );
  const { data: enrollmentsData } = useSWR<EnrollmentsResponse>(
    "/api/getEnrollments",
    fetcher
  );
  const { data: lecturersData } = useSWR<{ data: Lecturer[] }>(
    "/api/getLecturers",
    fetcher
  );

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignStudentsDialogOpen, setIsAssignStudentsDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [session, setSession] = useState("2023/2024");
  const [semester, setSemester] = useState<"FIRST" | "SECOND">("FIRST");
  const [isPending, setIsPending] = useState(false);

  const [isAssignLecturerDialogOpen, setIsAssignLecturerDialogOpen] =
    useState(false);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");

  console.log(coursesData);

  // Handle assigning lecturer to course
  const handleAssignLecturer = async () => {
    if (!editingCourse || !selectedLecturerId) return;

    setIsPending(true);
    try {
      await assignCourseToLecturer({
        courseId: editingCourse.id,
        lecturerId: selectedLecturerId
      });
      toast.success("Lecturer assigned successfully");
      setIsAssignLecturerDialogOpen(false);
      mutate("/api/getCourses");
    } catch (error) {
      toast.error("Failed to assign lecturer");
    } finally {
      setIsPending(false);
    }
  };

  // Transform API data
  useEffect(() => {
    if (coursesData?.data) {
      const simplified = coursesData.data;
      setCourses(simplified);
    }
  }, [coursesData, enrollmentsData]);

  // Filter courses
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get lecturer name
  const getLecturerName = (lecturerId: string) => {
    if (!lecturersData?.data) return "Not Assigned";
    const lecturer = lecturersData.data.find((l) => l.id === lecturerId);
    return lecturer
      ? `${lecturer.user.firstName} ${lecturer.user.lastName}`
      : "Not Assigned";
  };

  // Get enrolled students for a course
  const getEnrolledStudents = (courseId: string) => {
    if (!enrollmentsData?.data || !studentsData?.data) return [];
    return enrollmentsData.data
      .filter((e) => e.courseId === courseId)
      .map((e) => studentsData.data.find((s) => s.id === e.studentId))
      .filter(Boolean) as Student[];
  };

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Enroll selected students
  const handleEnrollStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) return;

    setIsPending(true);
    try {
      // Call server action for each student
      const results = await Promise.all(
        selectedStudents.map((studentId) =>
          enrollStudentsInCourse({
            studentId,
            courseId: selectedCourse.id,
            session,
            semester
          })
        )
      );

      toast.success(`${results.length} students enrolled successfully`);
      setSelectedStudents([]);
      setIsAssignStudentsDialogOpen(false);

      // Refresh enrollments data
      mutate("/api/getEnrollments");
    } catch (error) {
      toast.error("Failed to enroll students");
    } finally {
      setIsPending(false);
    }
  };

  // Remove student from course
  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedCourse) return;

    setIsPending(true);
    try {
      await removeStudentFromCourse({
        studentId,
        courseId: selectedCourse.id
      });
      toast.success("Student removed from course");

      // Refresh enrollments data
      mutate("/api/getEnrollments");
    } catch (error) {
      toast.error("Failed to remove student");
    } finally {
      setIsPending(false);
    }
  };

  // Update course
  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    setIsPending(true);
    try {
      // You'll need to implement updateCourse server action similar to addCourse
      // await updateCourse(editingCourse);
      toast.success("Course updated successfully");
      setIsEditDialogOpen(false);
      mutate("/api/getCourses");
    } catch (error) {
      toast.error("Failed to update course");
    } finally {
      setIsPending(false);
    }
  };

  const [state, formAction, pending] = useActionState(addCourse, initialState);

  useEffect(() => {
    if (state.message === "unsuccess") {
      toast.error("Error adding course");
    } else if (state.message === "success") {
      toast.success("Course added successfully");
      mutate("/api/getCourses");
    }
  }, [state]);

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <div className=" w-full min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new course.
                  </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Course Code</Label>
                      <Input id="code" name="code" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input id="title" name="title" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="creditUnits">Credit Units</Label>
                      <Input
                        id="creditUnits"
                        name="creditUnits"
                        type="number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="level">Level</Label>
                      <Input id="level" name="level" type="number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select name="semester">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key={1} value={"FIRST"}>
                            FIRST
                          </SelectItem>
                          <SelectItem key={2} value={"SECOND"}>
                            SECOND
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" name="department" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? "Adding Courses" : "Add Course"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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

          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>
                      {getLecturerName(course.lecturer?.id ?? "")}
                    </TableCell>
                    <TableCell>
                      {getEnrolledStudents(course.id).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsAssignStudentsDialogOpen(true);
                        }}
                      >
                        <Users className="h-4 w-4" />
                        <span className="sr-only">Assign Students</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCourse(course);
                          setEditingCourse(course);
                          setIsAssignLecturerDialogOpen(true);
                        }}
                      >
                        <School2 className="h-4 w-4" />
                        <span className="sr-only">Assign Lecturer</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* Assign Lecturer Dialog */}
      <Dialog
        open={isAssignLecturerDialogOpen}
        onOpenChange={setIsAssignLecturerDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lecturer to {editingCourse?.code}</DialogTitle>
            <DialogDescription>
              Select a lecturer to assign to this course.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lecturer">Lecturer</Label>
                <Select
                  value={selectedLecturerId}
                  onValueChange={setSelectedLecturerId}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {lecturersData?.data?.map((lecturer) => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.user.firstName} {lecturer.user.lastName} (
                        {lecturer.staffId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignLecturerDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignLecturer}
              disabled={isPending || !selectedLecturerId}
            >
              {isPending ? "Assigning..." : "Assign Lecturer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Students Dialog */}
      <Dialog
        open={isAssignStudentsDialogOpen}
        onOpenChange={(open) => {
          setIsAssignStudentsDialogOpen(open);
          if (!open) setSelectedStudents([]);
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign Students to {selectedCourse?.code}</DialogTitle>
            <DialogDescription>
              Select students to enroll in {selectedCourse?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Available Students</h3>
                  <div className="border rounded-md max-h-64 overflow-auto">
                    {studentsData?.data
                      ?.filter(
                        (student) =>
                          !getEnrolledStudents(selectedCourse.id).some(
                            (s) => s.id === student.id
                          )
                      )
                      .map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelect(student.id)}
                            disabled={isPending}
                          />
                          <label
                            htmlFor={`student-${student.id}`}
                            className="text-sm"
                          >
                            {student.user.firstName} {student.user.lastName} (
                            {student.matricNo})
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Enrolled Students</h3>
                  <div className="border rounded-md max-h-64 overflow-auto">
                    {getEnrolledStudents(selectedCourse.id).map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50"
                      >
                        <span className="text-sm">
                          {student.user.firstName} {student.user.lastName} (
                          {student.matricNo})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.id)}
                          disabled={isPending}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    {getEnrolledStudents(selectedCourse.id).length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No students enrolled yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="session">Academic Session</Label>
                  <Input
                    id="session"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={semester}
                    onValueChange={(value: "FIRST" | "SECOND") =>
                      setSemester(value)
                    }
                    required
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIRST">First Semester</SelectItem>
                      <SelectItem value="SECOND">Second Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignStudentsDialogOpen(false);
                setSelectedStudents([]);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnrollStudents}
              disabled={isPending || selectedStudents.length === 0}
            >
              {isPending ? "Processing..." : "Enroll Students"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update the course details and lecturer assignment.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Course Code</Label>
                <Input
                  id="edit-code"
                  value={editingCourse.code}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, code: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Course Title</Label>
                <Input
                  id="edit-title"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      title: e.target.value
                    })
                  }
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingCourse.department}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      department: e.target.value
                    })
                  }
                />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="edit-lecturer">Assign Lecturer</Label>
                <Select
                  value={editingCourse.lecturerId}
                  onValueChange={(value) =>
                    setEditingCourse({ ...editingCourse, lecturerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defaultLecturerId">
                      No lecturer assigned
                    </SelectItem>{" "}
                    {/* Updated default value */}
                    {mockData.lecturers.map((lecturer) => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.name} - {lecturer.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse}>Update Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
