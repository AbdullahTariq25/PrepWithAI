"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Eye,
  Palette,
  Layout,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Globe,
} from "lucide-react";

interface ResumeSection {
  id: string;
  type:
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages";
  title: string;
  visible: boolean;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    color: "from-indigo-500 to-purple-500",
    description: "Clean & professional",
  },
  {
    id: "minimal",
    name: "Minimal",
    color: "from-gray-500 to-gray-600",
    description: "Simple & elegant",
  },
  {
    id: "creative",
    name: "Creative",
    color: "from-pink-500 to-rose-500",
    description: "Stand out design",
  },
  {
    id: "technical",
    name: "Technical",
    color: "from-emerald-500 to-teal-500",
    description: "Developer focused",
  },
];

const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: "personal", type: "personal", title: "Personal Info", visible: true },
  {
    id: "summary",
    type: "summary",
    title: "Professional Summary",
    visible: true,
  },
  {
    id: "experience",
    type: "experience",
    title: "Work Experience",
    visible: true,
  },
  { id: "education", type: "education", title: "Education", visible: true },
  { id: "skills", type: "skills", title: "Technical Skills", visible: true },
  { id: "projects", type: "projects", title: "Projects", visible: true },
  {
    id: "certifications",
    type: "certifications",
    title: "Certifications",
    visible: false,
  },
  { id: "languages", type: "languages", title: "Languages", visible: false },
];

export default function ResumeBuilderPage() {
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [activeSection, setActiveSection] = useState("personal");
  const [sections, setSections] = useState<ResumeSection[]>(DEFAULT_SECTIONS);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [""],
    },
  ]);
  const [education, setEducation] = useState<Education[]>([
    {
      id: "1",
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    },
  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "", description: "", technologies: [], link: "" },
  ]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        highlights: [""],
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills((prev) => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        technologies: [],
        link: "",
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const analyzeATS = async () => {
    setIsAnalyzing(true);
    // Simulate ATS analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    let score = 0;
    if (personalInfo.fullName) score += 10;
    if (personalInfo.email) score += 10;
    if (personalInfo.phone) score += 5;
    if (personalInfo.linkedin) score += 5;
    if (summary.length > 50) score += 15;
    if (experiences.some((e) => e.company && e.position)) score += 20;
    if (education.some((e) => e.school && e.degree)) score += 10;
    if (skills.length >= 5) score += 15;
    if (projects.some((p) => p.name && p.description)) score += 10;
    setAtsScore(Math.min(score, 100));
    setIsAnalyzing(false);
  };

  const sectionIcons: Record<string, React.ReactNode> = {
    personal: <FileText className="w-4 h-4" />,
    summary: <Sparkles className="w-4 h-4" />,
    experience: <Briefcase className="w-4 h-4" />,
    education: <GraduationCap className="w-4 h-4" />,
    skills: <Code2 className="w-4 h-4" />,
    projects: <Globe className="w-4 h-4" />,
    certifications: <Award className="w-4 h-4" />,
    languages: <Globe className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-[#080808]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            Resume Builder
          </h1>
          <p className="text-gray-400 mt-1">
            Create an ATS-optimized resume with AI assistance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={analyzeATS}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            ATS Score
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ATS Score Banner */}
      <AnimatePresence>
        {atsScore !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-xl border ${
              atsScore >= 80
                ? "bg-emerald-500/10 border-emerald-500/20"
                : atsScore >= 50
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {atsScore >= 80 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <p className="text-white font-medium">
                    ATS Compatibility Score: {atsScore}%
                  </p>
                  <p className="text-sm text-gray-400">
                    {atsScore >= 80
                      ? "Great! Your resume is well-optimized for ATS systems."
                      : "Add more content to improve your ATS score."}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{atsScore}%</div>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  atsScore >= 80
                    ? "bg-emerald-500"
                    : atsScore >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${atsScore}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Selection */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-indigo-400" />
          <h3 className="text-white font-medium">Choose Template</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedTemplate === template.id
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div
                className={`w-full h-16 rounded-lg bg-linear-to-br ${template.color} mb-2 opacity-80`}
              />
              <p className="text-white text-sm font-medium">{template.name}</p>
              <p className="text-gray-500 text-xs">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 rounded-xl border border-white/10 p-4 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white font-medium">Sections</h3>
            </div>
            <div className="space-y-1">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    activeSection === section.id
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <GripVertical className="w-3 h-3 opacity-50" />
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-2 flex-1 text-left text-sm"
                  >
                    {sectionIcons[section.type]}
                    {section.title}
                  </button>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      section.visible
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-white/20"
                    }`}
                  >
                    {section.visible && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            {/* Personal Info Section */}
            {activeSection === "personal" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      Location
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={personalInfo.linkedin}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={personalInfo.github}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-400 mb-1 block">
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      value={personalInfo.portfolio}
                      onChange={(e) =>
                        setPersonalInfo((prev) => ({
                          ...prev,
                          portfolio: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="https://johndoe.dev"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary Section */}
            {activeSection === "summary" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Professional Summary
                </h3>
                <p className="text-sm text-gray-400">
                  Write a compelling 2-3 sentence summary of your experience and
                  goals.
                </p>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none resize-none"
                  placeholder="Experienced full-stack developer with 5+ years building scalable web applications..."
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {summary.length} characters
                  </span>
                  <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Generate
                  </button>
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    Work Experience
                  </h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Position
                  </button>
                </div>
                {experiences.map((exp, index) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    index={index}
                    onUpdate={(updated) => {
                      setExperiences((prev) =>
                        prev.map((e) => (e.id === exp.id ? updated : e)),
                      );
                    }}
                    onRemove={() => removeExperience(exp.id)}
                    canRemove={experiences.length > 1}
                  />
                ))}
              </motion.div>
            )}

            {/* Education Section */}
            {activeSection === "education" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    Education
                  </h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
                {education.map((edu, index) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Education {index + 1}
                      </span>
                      {education.length > 1 && (
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          School
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, school: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="MIT"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, degree: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, field: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          GPA (optional)
                        </label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, gpa: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="3.8/4.0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, startDate: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEducation((prev) =>
                              prev.map((item) =>
                                item.id === edu.id
                                  ? { ...item, endDate: val }
                                  : item,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  Technical Skills
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Type a skill and press Enter..."
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-indigo-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No skills added yet. Type above to add.
                    </p>
                  )}
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400 mb-2">
                    Suggested skills for developers:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "React",
                      "TypeScript",
                      "Node.js",
                      "Python",
                      "SQL",
                      "AWS",
                      "Docker",
                      "Git",
                      "REST APIs",
                      "GraphQL",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          if (!skills.includes(s))
                            setSkills((prev) => [...prev, s]);
                        }}
                        className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs hover:bg-white/10 hover:text-white"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Project {index + 1}
                      </span>
                      {projects.length > 1 && (
                        <button
                          onClick={() => removeProject(project.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProjects((prev) =>
                              prev.map((p) =>
                                p.id === project.id ? { ...p, name: val } : p,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="E-commerce Platform"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Link
                        </label>
                        <input
                          type="url"
                          value={project.link}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProjects((prev) =>
                              prev.map((p) =>
                                p.id === project.id ? { ...p, link: val } : p,
                              ),
                            );
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Description
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects((prev) =>
                            prev.map((p) =>
                              p.id === project.id
                                ? { ...p, description: val }
                                : p,
                            ),
                          );
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="Built a scalable e-commerce platform with..."
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Certifications & Languages (placeholder) */}
            {(activeSection === "certifications" ||
              activeSection === "languages") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">
                  {activeSection === "certifications"
                    ? "Certifications"
                    : "Languages"}
                </h3>
                <p className="text-gray-400 text-sm">
                  This section is optional. Toggle it on from the sidebar to
                  include it.
                </p>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
              <button className="flex items-center gap-2 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                <Save className="w-4 h-4" />
                Save Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900">
                {personalInfo.fullName || "Your Name"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {[personalInfo.email, personalInfo.phone, personalInfo.location]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
              {summary && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
                    Summary
                  </h3>
                  <p className="text-gray-700 text-sm mt-2">{summary}</p>
                </div>
              )}
              {experiences.some((e) => e.company) && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
                    Experience
                  </h3>
                  {experiences
                    .filter((e) => e.company)
                    .map((exp) => (
                      <div key={exp.id} className="mt-3">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900 text-sm">
                            {exp.position}
                          </p>
                          <p className="text-xs text-gray-500">
                            {exp.startDate} -{" "}
                            {exp.current ? "Present" : exp.endDate}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        {exp.description && (
                          <p className="text-gray-700 text-xs mt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
              {skills.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
                    Skills
                  </h3>
                  <p className="text-gray-700 text-sm mt-2">
                    {skills.join(" • ")}
                  </p>
                </div>
              )}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExperienceCard({
  experience,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  experience: Experience;
  index: number;
  onUpdate: (exp: Experience) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          Position {index + 1}
          {experience.company && ` — ${experience.company}`}
        </button>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Company</label>
            <input
              type="text"
              value={experience.company}
              onChange={(e) =>
                onUpdate({ ...experience, company: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Google"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Position</label>
            <input
              type="text"
              value={experience.position}
              onChange={(e) =>
                onUpdate({ ...experience, position: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Senior Software Engineer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Start Date
            </label>
            <input
              type="month"
              value={experience.startDate}
              onChange={(e) =>
                onUpdate({ ...experience, startDate: e.target.value })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">End Date</label>
            <input
              type="month"
              value={experience.endDate}
              onChange={(e) =>
                onUpdate({ ...experience, endDate: e.target.value })
              }
              disabled={experience.current}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
            <label className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <input
                type="checkbox"
                checked={experience.current}
                onChange={(e) =>
                  onUpdate({ ...experience, current: e.target.checked })
                }
                className="rounded"
              />
              Currently working here
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">
              Description
            </label>
            <textarea
              value={experience.description}
              onChange={(e) =>
                onUpdate({ ...experience, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
