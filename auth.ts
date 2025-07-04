import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connect } from "./lib/db.config";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          await connect();

          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return user;
        } catch (error) {
          console.log("Error:", error);
        }
      },
    }),
    Google,
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { name, email } = user;

          await connect();
          const ifUserExists = await User.findOne({ email });
          if (ifUserExists) {
            return true;
          }

          const newUser = new User({
            name: name,
            email: email,
            role: "guest",
          });

          const res = await newUser.save();
          if (res.status === 200 || res.status === 201) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          console.log(err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const { name, email } = user;
        token.email = email;
        token.name = name;

        try {
          await connect();
          const ifUserExists = await User.findOne({ email });
          if (ifUserExists) {
            token.role = ifUserExists.role;
            token._id = ifUserExists._id.toString();
          }
        } catch (err) {
          token.role = "guest";
          console.log(err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name;
        session.user.role = token.role as string;
        session.user._id = token._id as string;
      }
      return session;
    },
  },
});
