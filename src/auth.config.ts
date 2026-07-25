import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth?.user;
    },
  },
  providers: [],
};