import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getInitialUsers } from "@/store/userData";
import { UserRole } from "@/types/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // In a real app, you'd check the credentials against a database.
        // For our mock system, we'll just check if the email exists among our mock users
        // and use a fake password check since we don't have real passwords in mock data
        const users = getInitialUsers();
        const user = users.find(
          (user) =>
            user.email.toLowerCase() === credentials.email.toLowerCase(),
        );

        // For demo purposes, allow any password for the mock users
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "this-is-a-secret-value-with-at-least-32-characters",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
