"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Send,
  Building2,
  Briefcase,
  Wand2,
  CheckCircle,
  RotateCcw,
  Eye,
  Palette,
} from "lucide-react";

const TONES = [
  { id: "professional", label: "Professional", icon: "👔" },
  { id: "enthusiastic", label: "Enthusiastic", icon: "🚀" },
  { id: "conversational", label: "Conversational", icon: "💬" },
  { id: "formal", label: "Formal", icon: "📋" },
];

const TEMPLATES = [
  { id: "standard", name: "Standard", description: "Traditional format" },
  { id: "modern", name: "Modern", description: "Contemporary style" },
  { id: "startup", name: "Startup", description: "Casual & dynamic" },
  { id: "executive", name: "Executive", description: "Senior positions" },
];

export default function CoverLetterPage() {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [keySkills, setKeySkills] = useState("");
  const [whyCompany, setWhyCompany] = useState("");

  const generateCoverLetter = async () => {
    if (!companyName || !jobTitle) return;
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in software engineering and passion for building impactful products, I am excited about the opportunity to contribute to your team.

${keySkills ? `My key technical skills include ${keySkills}, which I have honed through years of building production-grade applications. ` : ""}Throughout my career, I have consistently delivered high-quality solutions, collaborating with cross-functional teams to drive product innovation and technical excellence.

${whyCompany ? `I am particularly drawn to ${companyName} because ${whyCompany}. ` : `I have long admired ${companyName}'s commitment to innovation and engineering excellence. `}The opportunity to work on challenging problems alongside talented engineers is exactly the kind of environment where I thrive.

${jobDescription ? "After reviewing the job description, I am confident that my experience aligns well with your requirements. " : ""}I would welcome the opportunity to discuss how my skills and experience can benefit your team.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]`;

    setGeneratedLetter(letter);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLetter);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 page-enter bg-[#080808]">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-rose-500/20 rounded-xl">
            <FileText className="w-6 h-6 text-rose-400" />
          </div>
          AI Cover Letter Generator
        </h1>
        <p className="text-gray-400 mt-1">
          Generate tailored cover letters for any job application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          {/* Company & Role */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Job Details
            </h3>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Google, Meta, Stripe..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Job Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Job Description (optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none resize-none"
                placeholder="Paste the job description for a more tailored letter..."
              />
            </div>
          </div>

          {/* Personalization */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Personalization
            </h3>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Key Skills to Highlight
              </label>
              <input
                type="text"
                value={keySkills}
                onChange={(e) => setKeySkills(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                placeholder="React, TypeScript, System Design..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Why This Company?
              </label>
              <textarea
                value={whyCompany}
                onChange={(e) => setWhyCompany(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none resize-none"
                placeholder="What excites you about this company..."
              />
            </div>
          </div>

          {/* Tone & Template */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Style
            </h3>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tone</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-2 rounded-lg border text-center text-sm transition-all ${
                      tone === t.id
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span className="block text-lg mb-1">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedTemplate === t.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCoverLetter}
            disabled={!companyName || !jobTitle || isGenerating}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 min-h-96">
            {generatedLetter ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Generated Cover Letter
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm leading-relaxed focus:border-indigo-500 focus:outline-none resize-none font-mono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={generateCoverLetter}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors">
                    <Send className="w-4 h-4" />
                    Use in Application
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <Briefcase className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-white font-medium mb-2">
                  Your Cover Letter Will Appear Here
                </h3>
                <p className="text-gray-500 text-sm max-w-sm">
                  Fill in the job details on the left and click generate to
                  create a personalized cover letter.
                </p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h4 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Cover Letter Tips
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
                Customize each letter for the specific company and role
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
                Keep it concise — ideally under one page
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
                Use specific examples and quantifiable achievements
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
                Mirror keywords from the job description
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
