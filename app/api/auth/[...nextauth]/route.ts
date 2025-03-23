import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/db/connection";
import User from "@/db/model/user";
import "next-auth";

declare module "next-auth" {
    interface User {
      id: string;
      role: string;
    }
  
    interface Session {
      user: {
        id: string;
        name?: string;
        email?: string;
        image?: string;
        role: string;
      };
    }
  }
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        action: { type: "text" }, // 'login' or 'register'
        name: { type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await db();

        // Handle registration
        if (credentials.action === "register") {
          if (!credentials.name) {
            throw new Error("Name is required for registration");
          }

          // Check if user already exists
          const existingUser = await User.findOne({ email: credentials.email });

          if (existingUser) {
            throw new Error("User with this email already exists");
          }

          // Create new user
          const newUser = await User.create({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            role: "user", // Default role
          });

          return {
            id: String(newUser._id),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          };
        }

        // Handle login (default)
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.password !== credentials.password) {
          throw new Error("Invalid password");
        }

        // Return user object that will be stored in the JWT
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token when user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and role to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 60, // 1 minute in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };