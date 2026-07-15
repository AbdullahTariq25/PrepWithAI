import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { analyzeResumeText, extractPdfText } from "@/lib/resume-analysis";
import { analyzeResumeJobMatch } from "@/lib/job-match";
import User from "@/models/User";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_EXTRACTED_TEXT = 120;
const MAX_JOB_DESCRIPTION = 12_000;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume");
    const rawJobDescription = formData.get("jobDescription");
    const jobDescription =
      typeof rawJobDescription === "string" ? rawJobDescription.trim() : "";

    if (jobDescription.length > MAX_JOB_DESCRIPTION) {
      return NextResponse.json(
        { error: "The target job description cannot exceed 12,000 characters" },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No PDF resume was uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The PDF must be larger than 0 bytes and no more than 10 MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
      return NextResponse.json(
        { error: "The uploaded file does not appear to be a valid PDF" },
        { status: 400 },
      );
    }

    const extracted = await extractPdfText(buffer);
    if (extracted.text.length < MIN_EXTRACTED_TEXT) {
      return NextResponse.json(
        {
          error:
            "We could not extract enough selectable text from this PDF. It may be image-only or scanned; export a text-based PDF and try again.",
        },
        { status: 422 },
      );
    }

    const parsed = analyzeResumeText(extracted.text, extracted.pages, extracted.parser);
    const jobMatch =
      jobDescription.length >= 80
        ? analyzeResumeJobMatch(extracted.text, jobDescription)
        : null;

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      $set: {
        resumeParsed: {
          ...parsed,
          jobMatch,
          sourceFileName: file.name.slice(0, 180),
          analyzedAt: new Date(),
        },
      },
      $unset: {
        resumeUrl: 1,
      },
    });

    return NextResponse.json({
      parsed,
      jobMatch,
      message: jobMatch
        ? "Resume extracted, analyzed, and compared with the target job description"
        : "Resume text extracted and analyzed successfully",
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      {
        error:
          "We could not analyze this PDF. Try exporting it again as a standard text-based PDF.",
      },
      { status: 500 },
    );
  }
}
