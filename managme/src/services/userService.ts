import { User } from "@/models/user";

export class UserService {
  private static readonly STORAGE_KEY = "currentUser";
  private static mockUser: User = {
    id: "user-1",
    firstName: "Elon",
    lastName: "Musk",
  };

  static getCurrentUser(): User {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // Ustaw mocka użytkownika, jeśli nie ma zapisanego
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mockUser));
    return this.mockUser;
  }

  static updateCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}
