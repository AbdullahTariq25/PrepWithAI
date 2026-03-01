import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";
import User from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      plan: string;
      onboarded: boolean;
      eloRating: number;
      currentStreak: number;
      proTrialEndsAt?: string | null;
      isOnProTrial: boolean;
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allProviders: any[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  allProviders.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  allProviders.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

allProviders.push(
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string;
      const password = credentials?.password as string;
      if (!email || !password) {
        throw new Error("Please enter email and password");
      }
      await connectDB();
      const user = await User.findOne({ email }).select("+password");
      if (!user || !user.password) {
        throw new Error("Invalid email or password");
      }
      const isValid = await bcrypt.compare(password, user.password as string);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: allProviders,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
            plan: "pro",
          });
        } else if (existingUser.plan !== "pro") {
          existingUser.plan = "pro";
          await existingUser.save();
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email || user?.email });
        if (dbUser) {
          if (dbUser.plan !== "pro") {
            dbUser.plan = "pro";
            await dbUser.save();
          }
          token.id = dbUser._id.toString();
          token.plan = "pro";
          token.onboarded = dbUser.onboarded;
          token.eloRating = dbUser.eloRating;
          token.currentStreak = dbUser.currentStreak;
          token.proTrialEndsAt = null;
          token.isOnProTrial = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = "pro";
        session.user.onboarded = token.onboarded as boolean;
        session.user.eloRating = (token.eloRating as number) || 1200;
        session.user.currentStreak = (token.currentStreak as number) || 0;
        session.user.proTrialEndsAt = null;
        session.user.isOnProTrial = false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
