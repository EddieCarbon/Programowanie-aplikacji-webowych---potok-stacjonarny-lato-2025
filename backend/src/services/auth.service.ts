import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { usersService } from "./users.service";
import { Role } from "../models/enums/role.enum";
import type { User, GoogleUser, PublicUser } from "../models/user/user.model";
import config from "../../config.json";
import { serializeMongoDocument } from "../helpers/serialize_mongo_document";

const client = new OAuth2Client(config.google_client_id);

class AuthService {
  async authenticateUser(email: string, password: string) {
    try {
      const user = await usersService.getUserByEmail(email);
      if (!user || !user.password) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Update last login
      await usersService.updateLastLogin(serializeMongoDocument(user)._id);

      const token = this.generateToken(user._id, user.role, user.email);
      const refreshToken = this.generateRefreshToken(user._id);

      return {
        token,
        refreshToken,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      throw error;
    }
  }

  async authenticateWithGoogle(googleToken: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: config.google_client_id,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token");
      }

      const googleUserData: GoogleUser = {
        name: payload.name || "",
        email: payload.email || "",
        avatar: payload.picture,
        googleId: payload.sub,
      };

      // Check if user exists
      let user = await usersService.getUserByEmail(googleUserData.email);

      if (!user) {
        // Create new user with GUEST role
        const newUser = {
          ...googleUserData,
          role: Role.GUEST,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const userId = await usersService.createUser(newUser);
        user = await usersService.getUser(userId!);
      } else {
        // Update existing user with Google data
        await usersService.patchUser(user._id.toString(), {
          googleId: googleUserData.googleId,
          avatar: googleUserData.avatar,
          lastLogin: new Date(),
          updatedAt: new Date(),
        });
        user = await usersService.getUser(user._id.toString());
      }

      if (!user || !user.isActive) {
        throw new Error("Account is deactivated");
      }

      const token = this.generateToken(user._id, user.role, user.email);
      const refreshToken = this.generateRefreshToken(user._id);

      return {
        token,
        refreshToken,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.refresh_token_secret,
      ) as any;
      const user = await usersService.getUser(decoded.userId);

      if (!user || !user.isActive) {
        return null;
      }

      const newToken = this.generateToken(user._id, user.role, user.email);
      const newRefreshToken = this.generateRefreshToken(user._id);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return null;
    }
  }

  async getCurrentUser(userId: string): Promise<PublicUser | null> {
    const user = await usersService.getUser(userId);
    return user ? this.sanitizeUser(user) : null;
  }

  generateToken(userId: string, role: string, email: string) {
    return jwt.sign({ userId, role, email }, config.jwt_secret, {
      expiresIn: "1h",
    });
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, config.refresh_token_secret, {
      expiresIn: "7d",
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private sanitizeUser(user: User): PublicUser {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
