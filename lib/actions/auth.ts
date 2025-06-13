"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../db/prisma";

export const adminLogin = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (email == "admin@gmail.com" && password == "1234") {
    cookieStore.set("role", "ADMIN");
    cookieStore.set("id", "lkajdkjaks");
    return redirect("/dash/admin/dashboard");
  } else {
    return { message: "invalid login", status: 404 };
  }
};

export const lecturerLogin = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const data = await prisma.user.findUnique({
    where: {
      email: email
    },
    include: {
      lecturer: true
    }
  });

  if (password == data?.password && data.role == "LECTURER") {
    cookieStore.set("role", "LECTURER");
    cookieStore.set("id", data.lecturer?.id ?? "");
    return redirect("/dash/lecturer/dashboard");
  } else {
    return { message: "Invalid Login", status: 404 };
  }
};

export const studentLogin = async (prevState: any, formData: FormData) => {
  console.log(formData);

  const cookieStore = await cookies();

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const data = await prisma.user.findUnique({
    where: {
      email: email
    },
    include: {
      student: true
    }
  });

  if (password == data?.password && data.role == "STUDENT") {
    cookieStore.set("role", "STUDENT");
    cookieStore.set("id", data.student?.id ?? "");
    return redirect("/dash/student/dashboard");
  } else {
    console.log("error");
    return { message: "Invalid Login", status: 404 };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("id");
  cookieStore.delete("role");

  redirect("/");
};
