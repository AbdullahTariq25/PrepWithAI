import { NextRequest } from "next/server";
import { withAuth, AuthContext } from "@/lib/withAuth";
import { success, serverError } from "@/lib/response";
import User from "@/models/User";
import Session from "@/models/Session";
import UserProgress from "@/models/UserProgress";
import StudyGroup from "@/models/StudyGroup";
import FlashcardProgress from "@/models/FlashcardProgress";
import JobTarget from "@/models/JobTarget";
import BehaviorStory from "@/models/BehaviorStory";
import Offer from "@/models/Offer";
import ApiUsage from "@/models/ApiUsage";

async function handler(_req: NextRequest, { user }: AuthContext) {
  try {
    await Promise.all([
      Session.deleteMany({ userId: user.id }),
      UserProgress.deleteMany({ userId: user.id }),
      FlashcardProgress.deleteMany({ userId: user.id }),
      JobTarget.deleteMany({ userId: user.id }),
      BehaviorStory.deleteMany({ userId: user.id }),
      Offer.deleteMany({ userId: user.id }),
      ApiUsage.deleteMany({ userId: user.id }),
      StudyGroup.deleteMany({ ownerId: user.id }),
      StudyGroup.updateMany(
        { memberIds: user.id },
        { $pull: { memberIds: user.id } },
      ),
    ]);

    await User.findByIdAndDelete(user.id);

    return success({ message: "Account and associated product data permanently deleted" });
  } catch (error) {
    return serverError("Failed to delete account", error);
  }
}

export const DELETE = withAuth(handler);
