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

// Providers are enabled only when their credentials exist. The public auth UI
// currently exposes credentials sign-in only, but keeping optional provider
// configuration here avoids breaking existing OAuth-linked accounts.
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
      const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
      const password = credentials?.password as string | undefined;

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
        const email = user.email?.trim().toLowerCase();

        if (!email) return false;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          await User.create({
            name: user.name || "",
            email,
            image: user.image || "",
            plan: "free",
          });
        }
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user || trigger === "update") {
        await connectDB();
        const email = (token.email || user?.email)?.trim().toLowerCase();
        const dbUser = email ? await User.findOne({ email }) : null;

        if (dbUser) {
          const trialEnd = dbUser.proTrialEndsAt ? new Date(dbUser.proTrialEndsAt) : null;

          token.id = dbUser._id.toString();
          token.plan = dbUser.plan || "free";
          token.onboarded = dbUser.onboarded;
          token.eloRating = dbUser.eloRating;
          token.currentStreak = dbUser.currentStreak;
          token.proTrialEndsAt = trialEnd?.toISOString() || null;
          token.isOnProTrial = Boolean(
            dbUser.plan === "free" && trialEnd && trialEnd.getTime() > Date.now()
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as string) || "free";
        session.user.onboarded = Boolean(token.onboarded);
        session.user.eloRating = (token.eloRating as number) || 1200;
        session.user.currentStreak = (token.currentStreak as number) || 0;
        session.user.proTrialEndsAt = (token.proTrialEndsAt as string | null) || null;
        session.user.isOnProTrial = Boolean(token.isOnProTrial);
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
