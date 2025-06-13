"use client";

import Link from "next/link";
import { ArrowLeft, UserCog, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { adminLogin } from "@/lib/actions/auth";

const initialState = {
  message: ""
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

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
        <form action={formAction}>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-full bg-blue-100">
                <UserCog className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Administrator Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="admin@example.com"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
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
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {pending ? "Loggin In.." : "Login to Admin Dashboard"}
            </Button>
            <div className="text-center text-sm">
              <Link
                href="/auth"
                className="flex items-center justify-center text-gray-600 hover:text-blue-600"
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
