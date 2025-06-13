"use client";

import Link from "next/link";
import { ArrowLeft, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { lecturerLogin } from "@/lib/actions/auth";
import { toast } from "sonner";

const initialState = {
  message: ""
};

export default function LecturerLogin() {
  const [state, formAction, pending] = useActionState(
    lecturerLogin,
    initialState
  );

  useEffect(() => {
    if (state.message == "unsuccess") {
      toast.error("Error loggin in");
    } else if (state.message == "invalid login") {
      toast.error("Invalid Credentials!");
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-full bg-green-100">
              <School className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Lecturer Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the lecturer portal
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="lecturer@example.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              disabled={pending}
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {pending ? "Loggin In.." : "Login to Lecturer Dashboard"}
            </Button>
            <div className="text-center text-sm">
              <Link
                href="/auth"
                className="flex items-center justify-center text-gray-600 hover:text-green-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to role selection
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
