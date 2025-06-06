import type { User } from "../models/user/user.model";
import type { WithoutId } from "mongodb";
import { dbService } from "./db.service";

class UsersService {
  private collectionName = "users";

  getUsers(query: Record<string, any>) {
    return dbService.find<User>(query, this.collectionName);
  }

  getUser(id: string) {
    return dbService.findOne<User>(id, this.collectionName);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await dbService.find<User>({ email }, this.collectionName);
    return users.length > 0 ? users[0] : null;
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const users = await dbService.find<User>({ googleId }, this.collectionName);
    return users.length > 0 ? users[0] : null;
  }

  async createUser(user: WithoutId<User>) {
    return dbService.create(user, this.collectionName);
  }

  updateUser(id: string, user: WithoutId<User>) {
    return dbService.replace(id, user, this.collectionName);
  }

  patchUser(id: string, user: Partial<WithoutId<User>>) {
    return dbService.patch(id, user, this.collectionName);
  }

  deleteUser(id: string) {
    return dbService.delete(id, this.collectionName);
  }

  async updateLastLogin(id: string) {
    return this.patchUser(id, {
      lastLogin: new Date(),
      updatedAt: new Date(),
    });
  }

  async activateUser(id: string) {
    return this.patchUser(id, { isActive: true, updatedAt: new Date() });
  }

  async deactivateUser(id: string) {
    return this.patchUser(id, { isActive: false, updatedAt: new Date() });
  }
}

export const usersService = new UsersService();
