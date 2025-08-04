export const dynamic = "force-dynamic";
("use client");

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
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addStudent } from "@/lib/actions/admin";
import useSWR from "swr";
import { Student } from "@/types";

interface ApiResponse {
  data: Student[];
}

const initialState = {
  message: "",
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentsPage() {
  const { data, error, isLoading } = useSWR<ApiResponse>(
    "/api/getStudents",
    fetcher
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Transform API data to simplified format for the table
  useEffect(() => {
    if (data?.data) {
      const simplified = data.data;
      setStudents(simplified);
    }
  }, [data]);

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [state, formAction, pending] = useActionState(addStudent, initialState);

  useEffect(() => {
    if (state.message === "unsuccess") {
      toast.error("Error adding student");
    } else if (state.message === "success") {
      toast.success("Student added successfully");
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
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new student.
                  </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
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
                      <Label htmlFor="matricNo">Matriculation Number</Label>
                      <Input id="matricNo" name="matricNo" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" name="department" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="level">Level</Label>
                      <Input id="level" name="level" type="number" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button disabled={pending} type="submit">
                      {pending ? "Adding student..." : "Add Student"}
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
                placeholder="Search students..."
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
                  <TableHead>Matric No.</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.user.firstName} {student.user.lastName}
                    </TableCell>
                    <TableCell>{student.matricNo}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.level} Level </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
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
    </div>
  );
}
