import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../libs/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isWorker: boolean;
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile });
      return true;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback - input:', { token, user, account });
      if (user) {
        token.id = user.id;
        token.isWorker = await checkIfUserIsWorker(user.id);
      }
      console.log('JWT callback - output:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - input:', { session, token });
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.isWorker = token.isWorker as boolean;
      }
      console.log('Session callback - output:', session);
      return session;
    },
  },
  events: {
    async createUser(message) {
      console.log('User created:', message);
    },
    async linkAccount(message) {
      console.log('Account linked:', message);
    },
    async signIn(message) {
      console.log('User signed in:', message);
    },
  },
  // ... resto de la configuración
};

async function checkIfUserIsWorker(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/worker?userId=${encodeURIComponent(userId)}&checkWorkerStatus=true`);
    if (!response.ok) {
      throw new Error('Failed to check worker status');
    }
    const data = await response.json();
    return data.isWorker;
  } catch (error) {
    console.error('Error checking worker status:', error);
    return false;
  }
}

export default NextAuth(authOptions);

