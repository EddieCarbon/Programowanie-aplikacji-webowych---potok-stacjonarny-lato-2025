"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/services/userService";
import { User } from "@/models/user";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white mr-2">
        {user.firstName.charAt(0)}
        {user.lastName.charAt(0)}
      </div>
      <span>
        {user.firstName} {user.lastName}
      </span>
    </div>
  );
}
