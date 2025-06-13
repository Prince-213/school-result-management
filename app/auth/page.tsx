import Link from "next/link";
import { GraduationCap, School, UserCog } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Academic Results Management System
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Access and manage academic results based on your role
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Admin Card */}
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-blue-50 pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <UserCog className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-center text-xl text-blue-700">
                Administrator
              </CardTitle>
              <CardDescription className="text-center">
                System management and oversight
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-blue-100 p-1">✓</span>
                  Manage user accounts
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-blue-100 p-1">✓</span>
                  Configure system settings
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-blue-100 p-1">✓</span>
                  Generate reports
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/admin" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Login as Administrator
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Lecturer Card */}
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-green-50 pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <School className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-center text-xl text-green-700">
                Lecturer
              </CardTitle>
              <CardDescription className="text-center">
                Course management and grading
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-green-100 p-1">✓</span>
                  Record student grades
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-green-100 p-1">✓</span>
                  Manage course materials
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-green-100 p-1">✓</span>
                  View class performance
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/lecturer" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Login as Lecturer
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Student Card */}
          <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="bg-purple-50 pb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-center text-xl text-purple-700">
                Student
              </CardTitle>
              <CardDescription className="text-center">
                View academic results and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-purple-100 p-1">✓</span>
                  Access grades and transcripts
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-purple-100 p-1">✓</span>
                  Track academic progress
                </li>
                <li className="flex items-center">
                  <span className="mr-2 rounded-full bg-purple-100 p-1">✓</span>
                  View course materials
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/student" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Login as Student
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
