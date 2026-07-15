"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeAnalysis {
  skills?: string[];
  experience?: string;
  education?: string;
  projects?: string[];
}

export default function ResumePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function uploadResume(file: File) {
    setError("");
    setAnalysis(null);

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF resume.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The PDF must be 10 MB or smaller.");
      return;
    }

    setLoading(true);
    setFileName(file.name);
    try {
      const body = new FormData();
      body.append("resume", file);
      const response = await fetch("/api/resume/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to analyze the resume");
      setAnalysis(data.parsed || null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to analyze the resume");
    } finally {
      setLoading(false);
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadResume(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadResume(file);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 page-enter">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" /> Resume intelligence
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Turn your resume into better interview preparation.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9090a0] sm:text-base">
            Upload a PDF to extract useful experience and skills context. PrepWithAI can use that profile to make future interview preparation more relevant.
          </p>
        </div>
        <Link href="/resume/builder" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200">
          Open resume builder <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Upload resume</h2>
          <p className="mt-2 text-sm leading-6 text-[#7f7f91]">PDF only, up to 10 MB. The current analyzer extracts preparation context from the document workflow.</p>

          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleInput} className="hidden" />
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`mt-6 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition ${
              dragging ? "border-indigo-400 bg-indigo-500/10" : "border-white/10 bg-black/15 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-indigo-300" /> : <UploadCloud className="h-6 w-6 text-indigo-300" />}
            </div>
            <h3 className="mt-5 font-semibold">{loading ? "Analyzing resume…" : "Drop a PDF here or browse"}</h3>
            <p className="mt-2 text-xs leading-5 text-[#6f6f80]">Your selected file is processed through the authenticated resume endpoint.</p>
          </div>

          {fileName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/7 bg-white/[0.03] p-3">
              <FileText className="h-5 w-5 text-indigo-300" />
              <span className="min-w-0 flex-1 truncate text-sm text-[#c7c7d1]">{fileName}</span>
              {analysis && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/7 bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Preparation profile</h2>
              <p className="mt-1 text-sm text-[#777789]">Context extracted from your latest resume analysis.</p>
            </div>
            {analysis && (
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={loading}>
                Replace PDF
              </Button>
            )}
          </div>

          {!analysis ? (
            <div className="mt-6 flex min-h-[28rem] items-center justify-center rounded-2xl border border-dashed border-white/8 bg-white/[0.02] px-8 text-center">
              <div className="max-w-md">
                <FileText className="mx-auto h-8 w-8 text-[#5f5f72]" />
                <h3 className="mt-4 font-semibold text-[#d6d6df]">No resume analyzed yet</h3>
                <p className="mt-2 text-sm leading-6 text-[#767687]">Upload a PDF to create a preparation profile. You will see extracted skills, experience context, education, and project signals here.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Resume processed</div>
                <p className="mt-2 text-sm leading-6 text-[#a2a2b0]">Your profile context is ready for more personalized preparation workflows.</p>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646476]">Detected skills</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(analysis.skills || []).map((skill) => (
                    <span key={skill} className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-[#c7c7d2]">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/7 bg-black/15 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#666678]">Experience context</div>
                  <p className="mt-3 text-sm leading-6 text-[#a0a0ae]">{analysis.experience || "No experience summary was returned."}</p>
                </div>
                <div className="rounded-xl border border-white/7 bg-black/15 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#666678]">Education context</div>
                  <p className="mt-3 text-sm leading-6 text-[#a0a0ae]">{analysis.education || "No education summary was returned."}</p>
                </div>
              </div>

              {(analysis.projects || []).length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#646476]">Project signals</div>
                  <div className="mt-3 space-y-3">
                    {(analysis.projects || []).map((project) => (
                      <div key={project} className="flex gap-3 rounded-xl border border-white/7 bg-black/15 p-4 text-sm leading-6 text-[#a8a8b5]">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-300" />
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.05] p-4 text-xs leading-6 text-amber-100/70">
                Resume analysis quality depends on the current parsing pipeline. Review generated context before relying on it for important career decisions.
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
