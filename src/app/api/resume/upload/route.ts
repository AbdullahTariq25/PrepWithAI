import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB" }, { status: 400 });
    }

    // Read file content - in production you'd upload to cloud storage
    // and use a PDF parsing service. For now, simulate AI parsing.
    const parsed = {
      skills: [
        "JavaScript", "TypeScript", "React", "Node.js", "Python",
        "SQL", "MongoDB", "Git", "Docker", "AWS",
      ],
      experience: "Based on your resume, you appear to have 2-4 years of experience as a Full Stack Developer with focus on web technologies and cloud services.",
      education: "Bachelor's in Computer Science with relevant coursework in Data Structures, Algorithms, and Software Engineering.",
      projects: [
        "Built a real-time collaboration tool using WebSockets and React",
        "Designed and implemented REST APIs serving 10k+ daily requests",
        "Developed CI/CD pipeline reducing deployment time by 60%",
      ],
    };

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      resumeUrl: `resume_${session.user.id}_${Date.now()}.pdf`,
      resumeParsed: {
        skills: parsed.skills,
        experience: parsed.experience,
        education: parsed.education,
        targetRoles: ["Full Stack Developer", "Frontend Engineer"],
      },
    });

    return NextResponse.json({ parsed });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
