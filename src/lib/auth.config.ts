import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnRegister = nextUrl.pathname.startsWith("/register");

      if (isOnAdmin && auth?.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) {
          const isActive = (auth?.user as Record<string, unknown>)?.isActive;
          if (!isActive) {
            return NextResponse.redirect(new URL("/onboarding", nextUrl));
          }
          return true;
        }
        return false;
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = (user as Record<string, unknown>).isActive as boolean;
      }
      // If token says inactive, check DB (handles post-payment activation)
      if (!token.isActive && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { isActive: true },
          });
          if (dbUser?.isActive) {
            token.isActive = true;
          }
        } catch {}
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as Record<string, unknown>).isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  providers: [],
};
