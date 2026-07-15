import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import StudyGroup from "@/models/StudyGroup";
import User from "@/models/User";

const MAX_GROUPS_PER_OWNER = 10;

function cleanTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 30)),
    ),
  ).slice(0, 8);
}

function serializeGroup(
  group: Record<string, unknown>,
  userId: string,
  ownerName?: string,
) {
  const members = Array.isArray(group.memberIds) ? group.memberIds : [];
  const memberIds = members.map((member) => String(member));
  const ownerId = String(group.ownerId || "");

  return {
    id: String(group._id),
    name: group.name,
    description: group.description || "",
    category: group.category || "General",
    tags: Array.isArray(group.tags) ? group.tags : [],
    members: memberIds.length,
    maxMembers: group.maxMembers || 20,
    isPublic: group.isPublic !== false,
    isMember: memberIds.includes(userId),
    isOwner: ownerId === userId,
    createdBy: ownerName || "PrepWithAI member",
    nextSessionAt: group.nextSessionAt || null,
    updatedAt: group.updatedAt,
    createdAt: group.createdAt,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const groups = await StudyGroup.find({
      $or: [
        { isPublic: true },
        { ownerId: session.user.id },
        { memberIds: session.user.id },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    const ownerIds = Array.from(
      new Set(groups.map((group) => String(group.ownerId)).filter(Boolean)),
    );
    const owners = await User.find({ _id: { $in: ownerIds } })
      .select("name")
      .lean();
    const ownerNames = new Map(
      owners.map((owner) => [String(owner._id), owner.name || "PrepWithAI member"]),
    );

    return NextResponse.json({
      groups: groups.map((group) =>
        serializeGroup(
          group as unknown as Record<string, unknown>,
          session.user.id,
          ownerNames.get(String(group.ownerId)),
        ),
      ),
    });
  } catch (error) {
    console.error("Study groups fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study groups" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : "General";
    const maxMembers = Number(body.maxMembers || 20);
    const isPublic = body.isPublic !== false;
    const tags = cleanTags(body.tags);
    const nextSessionAt =
      typeof body.nextSessionAt === "string" && body.nextSessionAt
        ? new Date(body.nextSessionAt)
        : undefined;

    if (name.length < 3 || name.length > 80) {
      return NextResponse.json(
        { error: "Group name must be between 3 and 80 characters" },
        { status: 400 },
      );
    }
    if (description.length > 500 || category.length > 60) {
      return NextResponse.json(
        { error: "Group description or category is too long" },
        { status: 400 },
      );
    }
    if (!Number.isInteger(maxMembers) || maxMembers < 2 || maxMembers > 100) {
      return NextResponse.json(
        { error: "Group size must be between 2 and 100 members" },
        { status: 400 },
      );
    }
    if (nextSessionAt && !Number.isFinite(nextSessionAt.getTime())) {
      return NextResponse.json(
        { error: "Next session date is invalid" },
        { status: 400 },
      );
    }

    await dbConnect();

    const ownedGroups = await StudyGroup.countDocuments({ ownerId: session.user.id });
    if (ownedGroups >= MAX_GROUPS_PER_OWNER) {
      return NextResponse.json(
        { error: `You can own up to ${MAX_GROUPS_PER_OWNER} study groups` },
        { status: 409 },
      );
    }

    const group = await StudyGroup.create({
      name,
      description,
      category,
      tags,
      maxMembers,
      isPublic,
      ownerId: session.user.id,
      memberIds: [session.user.id],
      nextSessionAt,
    });

    return NextResponse.json(
      {
        group: serializeGroup(
          group.toObject() as unknown as Record<string, unknown>,
          session.user.id,
          session.user.name || "PrepWithAI member",
        ),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Study group creation error:", error);
    return NextResponse.json(
      { error: "Failed to create study group" },
      { status: 500 },
    );
  }
}
