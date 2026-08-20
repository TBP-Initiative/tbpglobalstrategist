import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

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

      if (isOnAdmin && auth?.user?.role !== "ADMIN" && !(auth?.user as any)?.isPublishAssessor) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isPublishAssessor = (user as any).isPublishAssessor;
      }
      if (token.isPublishAssessor === undefined && token.id) {
        token.isPublishAssessor = false;
      }
      // Strip adapter-injected OAuth fields to keep JWT small
      delete (token as any).picture
      delete (token as any).provider
      delete (token as any).providerAccountId
      delete (token as any).access_token
      delete (token as any).refresh_token
      delete (token as any).expires_at
      delete (token as any).token_type
      delete (token as any).scope
      delete (token as any).id_token
      delete (token as any).session_state
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).isPublishAssessor = token.isPublishAssessor;
      }
      return session;
    },
  },
  providers: [],
};
