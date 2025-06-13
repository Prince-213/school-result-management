"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  X
} from "lucide-react";
import { logout } from "@/lib/actions/auth";

type SidebarProps = {
  className?: string;
  role?: string;
};

export function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation items based on user role
  const getNavItems = () => {
    if (role === "admin") {
      return [
        {
          name: "Dashboard",
          href: "/dash/admin/dashboard",
          icon: LayoutDashboard
        },
        { name: "Lecturers", href: "/dash/admin/lecturers", icon: Users },
        { name: "Students", href: "/dash/admin/students", icon: GraduationCap },
        { name: "Courses", href: "/dash/admin/courses", icon: BookOpen },
        { name: "Settings", href: "/dash/admin/settings", icon: Settings }
      ];
    } else if (role === "lecturer") {
      return [
        {
          name: "Dashboard",
          href: "/dash/lecturer",
          icon: LayoutDashboard
        },
        { name: "My Courses", href: "/dash/lecturer/courses", icon: BookOpen },
        {
          name: "Upload Results",
          href: "/dash/lecturer/results",
          icon: BarChart3
        },
        { name: "Profile", href: "/dash/lecturer/profile", icon: User }
      ];
    } else {
      return [
        {
          name: "Dashboard",
          href: "/dash/student",
          icon: LayoutDashboard
        },
        { name: "My Courses", href: "/dash/student/courses", icon: BookOpen },
        { name: "Results", href: "/dash/student/results", icon: BarChart3 },
        { name: "Profile", href: "/dash/student/profile", icon: User }
      ];
    }
  };

  const navItems = getNavItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const signOut = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="bg-white h-full w-64 shadow-lg flex flex-col">
          <div className="p-4 border-b flex items-center gap-2">
            <div className="bg-purple-600 text-white p-1.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
            <h1 className="text-lg font-bold">EduResults</h1>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
        <div
          className="bg-black bg-opacity-50 absolute inset-0 -z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 md:w-64 md:bg-white md:border-r",
          className
        )}
      >
        <div className="p-4 border-b flex items-center gap-2">
          <div className="bg-purple-600 text-white p-1.5 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h1 className="text-lg font-bold">EduResults</h1>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
