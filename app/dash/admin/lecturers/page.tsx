"use client";

import { useActionState, useEffect, useState } from "react";
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
import { mockData } from "@/lib/utils";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { addLecturer } from "@/lib/actions/admin";
import { toast } from "sonner";
import useSWR from "swr";
import { Lecturer } from "@/types";

interface ApiResponse {
  data: Lecturer[];
}

const initialState = {
  message: ""
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LecturersPage() {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    "/api/getLecturers",
    fetcher
  );

  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Transform API data to simplified format for the table
  useEffect(() => {
    if (data?.data) {
      const simplified = data.data;
      setLecturers(simplified);
    }
  }, [data]);

  // Filter lecturers based on search term
  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.user.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      lecturer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get full lecturer details by ID
  const getFullLecturerDetails = (lecturerId: string): Lecturer | undefined => {
    return data?.data.find((lecturer) => lecturer.id === lecturerId);
  };

  // Get courses assigned to a lecturer
  const getLecturerCourses = (lecturerId: string) => {
    return mockData.courses.filter(
      (course) => course.lecturerId === lecturerId
    );
  };

  const handleViewLecturer = (lecturerId: string) => {
    const fullDetails = getFullLecturerDetails(lecturerId);
    if (fullDetails) {
      setSelectedLecturer(fullDetails);
      setIsViewDialogOpen(true);
    }
  };

  const [state, formAction, pending] = useActionState(
    addLecturer,
    initialState
  );

  useEffect(() => {
    if (state.message === "unsuccess") {
      toast.error("Error adding lecturer");
    } else if (state.message === "success") {
      toast.success("Lecturer added successfully");
    }
  }, [state]);

  if (error) return "An error has occurred.";
  if (isLoading) return "Loading...";

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex-1 md:ml-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Lecturers</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={pending}
                  onClick={() => setIsAddDialogOpen(!isAddDialogOpen)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {pending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Add Lecturer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lecturer</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new lecturer.
                  </DialogDescription>
                </DialogHeader>
                <form action={formAction} method="POST">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="staffid">Staff ID</Label>
                      <Input id="staffid" name="staffid" type="text" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={pending}>
                      {pending ? "Adding lecturer..." : "Add Lecturer"}
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
                placeholder="Search lecturers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.map((lecturer) => (
                  <TableRow key={lecturer.id}>
                    <TableCell className="font-medium">
                      {lecturer.user.firstName} {lecturer.user.lastName}
                    </TableCell>
                    <TableCell>{lecturer.user.email}</TableCell>
                    <TableCell>{lecturer.department}</TableCell>
                    <TableCell>{lecturer.courses.length}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewLecturer(lecturer.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
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

      {/* View/Edit Lecturer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Lecturer Details</DialogTitle>
          </DialogHeader>
          {selectedLecturer && (
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="font-medium">
                    {selectedLecturer.user.firstName}{" "}
                    {selectedLecturer.user.lastName}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="font-medium">
                    {selectedLecturer.user.email}
                  </div>
                </div>
                <div>
                  <Label>Staff ID</Label>
                  <div className="font-medium">{selectedLecturer.staffId}</div>
                </div>
                <div>
                  <Label>Department</Label>
                  <div className="font-medium">
                    {selectedLecturer.department}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">
                  Assigned Courses ({selectedLecturer.courses.length})
                </Label>
                <div className="mt-2 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLecturer.courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.code}
                          </TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.description}</TableCell>
                        </TableRow>
                      ))}
                      {selectedLecturer.courses.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-4 text-gray-500"
                          >
                            No courses assigned yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button>Edit Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
