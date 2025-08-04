"use client";

import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { getBaseUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

/* export const metadata: Metadata = {
  title: "School Result Management System",
  description: "A comprehensive result management system for schools",
  generator: "v0.dev",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function checkAllLecturersPendingResults() {
      try {
        const res = await fetch("/api/getLecturers");
        const json = await res.json();
        const lecturers = json.data;
        if (!Array.isArray(lecturers)) return;
        lecturers.forEach(async (lecturer: any) => {
          if (!lecturer || !lecturer.user) return;
          const pendingResults =
            lecturer.results?.filter((r: any) => !r.published) || [];
          if (pendingResults.length > 0) {
            const title =
              lecturer.user.firstName && lecturer.user.lastName
                ? `${lecturer.user.firstName} ${lecturer.user.lastName}`
                : "Lecturer";
            const gender = "Mr/Mrs"; // Gender info not available, so use generic
            const email = lecturer.user.email;

            try {
              const response = await fetch(`${getBaseUrl()}/api/send`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  name: `${lecturer.user.firstName} ${lecturer.user.lastName}`,
                  role: "LECTURER",
                  message: `Dear ${gender} ${title}, you have ${pendingResults.length} pending results. Please attend to them immediately.`,
                }),
              });

              if (response.ok) {
                console.log("Email sent successfully!");

                return {
                  message: "success",
                };
              } else {
                const errorDetails = await response.json();
                console.error("Error sending email:", errorDetails.message);
                return {
                  message: "wrong",
                };
              }
            } catch (error) {
              console.error("There was a problem sending the email:", error);
              return {
                message: "wrong",
              };
            }
          }
        });
      } catch (err) {
        // Ignore errors silently
      }
    }
    interval = setInterval(checkAllLecturersPendingResults, 20000);
    checkAllLecturersPendingResults();
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
