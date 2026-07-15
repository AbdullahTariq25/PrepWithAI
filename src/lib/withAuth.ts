import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/response";
import dbConnect from "@/lib/mongodb";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  plan: string;
  onboarded: boolean;
  eloRating: number;
  currentStreak: number;
  proTrialEndsAt?: string | null;
  isOnProTrial?: boolean;
}

export interface AuthContext {
  user: AuthUser;
  params: Record<string, string>;
}

type RouteHandler = (
  req: NextRequest,
  context: AuthContext,
) => Promise<Response>;

type RouteHandlerNoContext = (req: NextRequest) => Promise<Response>;

export function withAuth(handler: RouteHandler | RouteHandlerNoContext) {
  return async (
    req: NextRequest,
    routeContext?: { params: Promise<Record<string, string>> },
  ): Promise<Response> => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return unauthorized("Authentication required");
      }

      await dbConnect();
      const resolvedParams = routeContext?.params ? await routeContext.params : {};
      const authContext: AuthContext = {
        user: session.user as AuthUser,
        params: resolvedParams,
      };

      return handler(req, authContext);
    } catch (error) {
      console.error("[withAuth] Error:", error);
      return serverError("Authentication error", error);
    }
  };
}

export function withAdmin(handler: RouteHandler) {
  return withAuth(async (req: NextRequest, context: AuthContext) => {
    const { default: User } = await import("@/models/User");
    const user = await User.findById(context.user.id).select("role").lean();

    if (!user || (user as { role?: string }).role !== "admin") {
      return unauthorized("Admin access required");
    }

    return handler(req, context);
  });
}
