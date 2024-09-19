import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../app/lib/mongodb";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
    } & DefaultSession["user"]
  }
  interface User {
    id?: string;
  }
}

export default NextAuth({
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            googleId: account.providerAccountId,
            accessToken: account.access_token,
          } as any, // Usamos 'as any' para evitar el error de TypeScript
          create: {
            name: user.name ?? '',
            email: user.email,
            googleId: account.providerAccountId,
            accessToken: account.access_token,
          } as any, // Usamos 'as any' para evitar el error de TypeScript
        });
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Redirige siempre a la página principal después de la autenticación
      return baseUrl;
    },
  },
});