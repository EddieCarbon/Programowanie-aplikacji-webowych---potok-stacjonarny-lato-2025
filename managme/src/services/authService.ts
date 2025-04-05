import { UserService } from "./userService";

export class AuthService {
  static async fetchWithAuth(url: string, options: RequestInit = {}) {
    let token = UserService.getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // If we get a 401 Unauthorized, try to refresh the token
      if (response.status === 401) {
        token = await UserService.refreshToken();

        // Retry the request with the new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return response;
    } catch (error) {
      console.error("Auth fetch error:", error);
      throw error;
    }
  }
}
