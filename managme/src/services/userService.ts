import { User } from "@/models/user";

export class UserService {
  private static readonly STORAGE_KEY = "currentUser";
  private static readonly TOKEN_KEY = "token";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";

  static getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }

  static updateCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  static isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem(this.TOKEN_KEY, data.token);

      return data.token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}
