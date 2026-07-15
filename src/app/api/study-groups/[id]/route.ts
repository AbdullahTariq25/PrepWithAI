import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import StudyGroup from "@/models/StudyGroup";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid study group" }, { status: 400 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action;
    if (action !== "join" && action !== "leave") {
      return NextResponse.json(
        { error: "Action must be join or leave" },
        { status: 400 },
      );
    }

    await dbConnect();
    const group = await StudyGroup.findById(id);
    if (!group) {
      return NextResponse.json({ error: "Study group not found" }, { status: 404 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const isMember = group.memberIds.some((memberId) => memberId.equals(userId));
    const isOwner = group.ownerId.equals(userId);

    if (action === "join") {
      if (!group.isPublic && !isMember && !isOwner) {
        return NextResponse.json(
          { error: "This study group is private" },
          { status: 403 },
        );
      }
      if (!isMember) {
        if (group.memberIds.length >= group.maxMembers) {
          return NextResponse.json(
            { error: "This study group is full" },
            { status: 409 },
          );
        }
        group.memberIds.push(userId);
      }
    } else {
      if (isOwner) {
        return NextResponse.json(
          { error: "The owner cannot leave the group. Delete it instead." },
          { status: 409 },
        );
      }
      group.memberIds = group.memberIds.filter((memberId) => !memberId.equals(userId));
    }

    await group.save();

    return NextResponse.json({
      membership: action === "join" ? "joined" : "left",
      members: group.memberIds.length,
    });
  } catch (error) {
    console.error("Study group membership error:", error);
    return NextResponse.json(
      { error: "Unable to update study group membership" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid study group" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await StudyGroup.findOneAndDelete({
      _id: id,
      ownerId: session.user.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Study group not found or you are not the owner" },
        { status: 404 },
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Study group deletion error:", error);
    return NextResponse.json(
      { error: "Unable to delete study group" },
      { status: 500 },
    );
  }
}
