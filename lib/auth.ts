import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required");
}

const API_URL =
  process.env.API_URL ||
  "https://e-voting-and-ticketing-backend.onrender.com/api";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "SUPER_ADMIN" | "ADMIN" | "ORGANIZER";
      avatar?: string;
      organizerId?: string;
      status?: string;
    };

    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "ORGANIZER";
    avatar?: string;
    organizerId?: string;
    accessToken?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "SUPER_ADMIN" | "ADMIN" | "ORGANIZER";
    organizerId?: string;
    accessToken?: string;
    status?: string;
  }
}

/**
 * Exported for unit testing. Contains the full credential validation logic
 * independently of next-auth's CredentialsProvider wrapper.
 */
export async function authorizeCredentials(
  credentials: Record<string, string> | undefined,
) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password are required");
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(
      data.message || data.error || "Invalid email or password",
    );
  }

  // Real backend returns { success: true, data: { token, user } }
  // We handle both wrapped and legacy root-level structure for robustness
  const apiData = data.data || data;
  const jwtToken = apiData.token || apiData.accessToken;
  const user = apiData.user;

  if (!jwtToken || !user) {
    throw new Error("Invalid response from server");
  }

  return {
    id: user.id || user._id,
    email: user.email,
    name: user.name || user.fullName,
    role: user.role,
    avatar: user.avatar || user.profileImage || undefined,
    organizerId: user.organizerId || user.id || user._id,
    accessToken: jwtToken,
    status: user.status,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizerId = user.organizerId;
        token.accessToken = user.accessToken;
        token.status = user.status;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.organizerId = token.organizerId;
        session.user.status = token.status;
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function getRoleRedirectPath(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin";
    case "ADMIN":
      return "/admin";
    case "ORGANIZER":
      return "/organizer";
    default:
      return "/";
  }
}

export function canAccessRoute(userRole: string, pathname: string): boolean {
  if (pathname.startsWith("/admin/super")) {
    return userRole === "SUPER_ADMIN";
  }
  if (pathname.startsWith("/admin")) {
    return userRole === "SUPER_ADMIN" || userRole === "ADMIN";
  }
  if (pathname.startsWith("/organizer")) {
    return (
      userRole === "SUPER_ADMIN" ||
      userRole === "ADMIN" ||
      userRole === "ORGANIZER"
    );
  }
  return true;
}
