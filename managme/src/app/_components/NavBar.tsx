"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfile from "./UserProfile";
import ProjectSelector from "./ProjectSelector";

export default function Navbar() {
  const pathname = usePathname();

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
          <Link
            href="/projects"
            className={`hover:text-gray-300 ${pathname.startsWith("/projects") ? "underline" : ""}`}
          >
            Projects
          </Link>
          <ProjectSelector />
          <UserProfile />
        </div>
      </div>
    </nav>
  );
}
