import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../app/lib/mongodb";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
    } & DefaultSession["user"]
  }
}

export const authOptions = {
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
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      console.log("Session callback called");
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name; // Incluimos el nombre del usuario en la sesión
        console.log(`Este es el nombre del usuario identificado: ${user.name}`);
      } else {
        console.log("Session user is undefined");
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

export default NextAuth(authOptions);
