import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isWorker: boolean;
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT | null }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);
      if (session.user && token) {
        session.user.id = token.sub ?? '';
        session.user.isWorker = (token.isWorker as boolean) ?? false;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: AdapterUser }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      if (user) {
        token.isWorker = await checkIfUserIsWorker(user.id);
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

async function checkIfUserIsWorker(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/worker?email=${encodeURIComponent(email)}&checkWorkerStatus=true`)
    if (!response.ok) {
      throw new Error('Failed to check worker status')
    }
    const data = await response.json()
    return data.isWorker
  } catch (error) {
    console.error('Error checking worker status:', error)
    return false
  }
}

export default NextAuth(authOptions);
