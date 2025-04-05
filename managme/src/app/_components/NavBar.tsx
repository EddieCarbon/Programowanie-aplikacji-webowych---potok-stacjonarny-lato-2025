"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import ProjectSelector from "./ProjectSelector";
import { UserService } from "@/services/userService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on component mount and after navigation
    setIsLoggedIn(UserService.isLoggedIn());
  }, [pathname]);

  const handleLogout = () => {
    UserService.logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ProjectManager
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className={`hover:text-gray-300 ${pathname === "/" ? "underline" : ""}`}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/projects"
                className={`hover:text-gray-300 ${pathname.startsWith("/projects") ? "underline" : ""}`}
              >
                Projects
              </Link>
              <ProjectSelector />
              <UserProfile />
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`hover:text-gray-300 ${pathname === "/login" ? "underline" : ""}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
