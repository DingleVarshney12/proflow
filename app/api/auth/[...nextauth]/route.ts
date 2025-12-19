import NextAuth, { NextAuthOptions, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User as UserTs } from "next-auth";
import { JWT } from "next-auth/jwt";
import connectDB from "@/database/mongodb";
import User from "@/models/user.model";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: { email?: string; password?: string } | undefined,
        request: any
      ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        await connectDB();
        const email = credentials.email;
        const password = credentials.password;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User Doesn't Exist");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Password is Incorrect");
        }
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: JWT; user?: UserTs }) {
      if (user) {
        token.id = user.id;
        token.name = user.name as string;
        token.email = user.email as string;
        token.role = user.role as string;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id! as string;
        session.user.name = token.name! as string;
        session.user.email = token.email! as string;
        session.user.role = token.role! as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
