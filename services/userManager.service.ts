// import { User } from "@/models/user";
import User from "@/models/user.model";

// Usunięto mockowe dane i funkcje

export class UserManager {
  static async getUserByIdAsync(id: string) {
    return User.findById(id);
  }
}
