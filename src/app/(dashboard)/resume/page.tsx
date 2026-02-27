"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Target,
  TrendingUp,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ParsedResume {
  skills: string[];
  experience: string;
  education: string;
  projects: string[];
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf"))) {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setParsed(data.parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter bg-[#080808]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">
          Resume <span className="gradient-text">Analysis</span>
        </h1>
        <p className="text-[#888] mt-1">
          Upload your resume for AI-powered interview preparation tailored to
          your experience.
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card
          className={`border-2 border-dashed transition-all duration-300 ${
            dragActive
              ? "border-indigo-500 bg-indigo-500/5"
              : file
                ? "border-green-500/30 bg-green-500/5"
                : "border-white/[0.06] hover:border-indigo-500/30"
          }`}
        >
          <CardContent className="p-8">
            <div
              className="flex flex-col items-center text-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
              />

              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-sm text-[#888]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setParsed(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        Remove
                      </Button>
                      <Button
                        variant="glow"
                        size="sm"
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-1.5" />
                        )}
                        {uploading ? "Analyzing..." : "Analyze Resume"}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4 cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        Drop your resume here
                      </p>
                      <p className="text-sm text-[#888] mt-1">
                        or click to browse · PDF only · Max 10MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-1.5" />
                      Choose File
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  className="flex items-center gap-2 text-destructive text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Parsed results */}
      <AnimatePresence>
        {parsed && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">
                Resume analyzed successfully!
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Detected Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Experience Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#888] leading-relaxed">
                    {parsed.experience}
                  </p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="w-5 h-5 text-green-500" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#888] leading-relaxed">
                    {parsed.education}
                  </p>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Notable Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {parsed.projects.map((p, i) => (
                      <li
                        key={i}
                        className="text-sm text-[#888] flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-indigo-500/20 bg-indigo-500/5">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-[#888] mb-4">
                  Your resume has been saved. AI interviews will now be tailored
                  to your background.
                </p>
                <Button variant="glow" asChild>
                  <Link href="/interview">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Start Tailored Interview
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefits */}
      {!parsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4">Why upload your resume?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: "Targeted Questions",
                desc: "AI asks questions based on your actual skills and experience level.",
              },
              {
                icon: TrendingUp,
                title: "Gap Analysis",
                desc: "Identifies skills you need to strengthen for your target role.",
              },
              {
                icon: Brain,
                title: "Personalized Prep",
                desc: "Interview difficulty and topics auto-adjust to match your background.",
              },
            ].map((b) => (
              <Card key={b.title}>
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
                    <b.icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{b.title}</h4>
                  <p className="text-xs text-[#888] leading-relaxed">
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
