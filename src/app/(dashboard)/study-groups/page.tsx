"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Globe,
  Lock,
  MessageSquare,
  Calendar,
  Crown,
  ChevronRight,
  UserPlus,
  Video,
  Clock,
} from "lucide-react";

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  category: string;
  isPublic: boolean;
  lastActive: string;
  nextSession: string | null;
  tags: string[];
  avatars: string[];
  createdBy: string;
}

const MOCK_GROUPS: StudyGroup[] = [
  {
    id: "1",
    name: "FAANG Interview Prep",
    description:
      "Daily DSA practice and mock interviews targeting FAANG companies. We do peer interviews every weekend.",
    members: 24,
    maxMembers: 30,
    category: "Interview Prep",
    isPublic: true,
    lastActive: "2 mins ago",
    nextSession: "Tomorrow 7:00 PM EST",
    tags: ["DSA", "System Design", "Mock Interviews"],
    avatars: ["A", "B", "C", "D"],
    createdBy: "Alex Chen",
  },
  {
    id: "2",
    name: "System Design Masters",
    description:
      "Deep dive into system design concepts. We review real-world architectures and practice design problems.",
    members: 18,
    maxMembers: 25,
    category: "System Design",
    isPublic: true,
    lastActive: "15 mins ago",
    nextSession: "Saturday 2:00 PM EST",
    tags: ["Distributed Systems", "Scalability", "Architecture"],
    avatars: ["E", "F", "G"],
    createdBy: "Sarah Kim",
  },
  {
    id: "3",
    name: "Frontend Interview Club",
    description:
      "React, JavaScript, and frontend system design. Weekly code reviews and pair programming.",
    members: 31,
    maxMembers: 40,
    category: "Frontend",
    isPublic: true,
    lastActive: "1 hour ago",
    nextSession: "Wednesday 6:00 PM EST",
    tags: ["React", "JavaScript", "CSS", "TypeScript"],
    avatars: ["H", "I", "J", "K"],
    createdBy: "Mike Johnson",
  },
  {
    id: "4",
    name: "Behavioral Interview Prep",
    description:
      "Practice STAR method responses, leadership principles, and common behavioral questions.",
    members: 12,
    maxMembers: 20,
    category: "Behavioral",
    isPublic: true,
    lastActive: "3 hours ago",
    nextSession: null,
    tags: ["STAR Method", "Leadership", "Communication"],
    avatars: ["L", "M"],
    createdBy: "Emily Davis",
  },
  {
    id: "5",
    name: "LeetCode Daily",
    description:
      "Solve one LeetCode problem daily. We discuss optimal solutions and different approaches.",
    members: 45,
    maxMembers: 50,
    category: "DSA",
    isPublic: true,
    lastActive: "5 mins ago",
    nextSession: "Daily 9:00 AM EST",
    tags: ["LeetCode", "Algorithms", "Problem Solving"],
    avatars: ["N", "O", "P", "Q"],
    createdBy: "David Park",
  },
  {
    id: "6",
    name: "ML/AI Interview Group",
    description:
      "ML system design, statistics, and coding problems for ML engineering roles.",
    members: 8,
    maxMembers: 15,
    category: "Machine Learning",
    isPublic: false,
    lastActive: "1 day ago",
    nextSession: "Friday 4:00 PM EST",
    tags: ["ML", "Statistics", "Python"],
    avatars: ["R", "S"],
    createdBy: "Lisa Wang",
  },
];

const CATEGORIES = [
  "All",
  "Interview Prep",
  "System Design",
  "Frontend",
  "Behavioral",
  "DSA",
  "Machine Learning",
];

export default function StudyGroupsPage() {
  const [groups] = useState<StudyGroup[]>(MOCK_GROUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 page-enter bg-[#080808]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            Study Groups
          </h1>
          <p className="text-[#888] mt-1">
            Join study groups to practice together and stay accountable
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Active Groups</span>
          </div>
          <p className="text-2xl font-bold text-white">{groups.length}</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <UserPlus className="w-4 h-4" />
            <span className="text-sm">Total Members</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {groups.reduce((sum, g) => sum + g.members, 0)}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Video className="w-4 h-4" />
            <span className="text-sm">Sessions This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Messages Today</span>
          </div>
          <p className="text-2xl font-bold text-white">247</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
            placeholder="Search groups by name, description, or tags..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/5 text-[#888] border border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group, index) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/5 rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all group cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {group.isPublic ? (
                  <Globe className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs text-[#666]">
                  {group.isPublic ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <Clock className="w-3 h-3" />
                {group.lastActive}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
              {group.name}
            </h3>
            <p className="text-[#888] text-sm mb-3 line-clamp-2">
              {group.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {group.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-white/5 text-[#888] rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Members */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {group.avatars.slice(0, 4).map((avatar, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-indigo-500/30 border border-[#111] flex items-center justify-center text-xs text-indigo-300"
                    >
                      {avatar}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#666]">
                  {group.members}/{group.maxMembers} members
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#666]">
                <Crown className="w-3 h-3 text-amber-400" />
                {group.createdBy}
              </div>
            </div>

            {/* Next Session */}
            {group.nextSession && (
              <div className="flex items-center gap-2 p-2 bg-indigo-500/10 rounded-lg mb-3">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span className="text-xs text-indigo-300">
                  Next: {group.nextSession}
                </span>
              </div>
            )}

            {/* Join Button */}
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
              <UserPlus className="w-3 h-3" />
              Join Group
              <ChevronRight className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-[#555] mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Groups Found</h3>
          <p className="text-[#888] text-sm mb-4">
            Try adjusting your search or create a new group.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111] rounded-xl border border-white/10 w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Create Study Group
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#888] mb-1 block">
                  Group Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g., Frontend Interview Prep"
                />
              </div>
              <div>
                <label className="text-sm text-[#888] mb-1 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none resize-none"
                  placeholder="What will this group focus on?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-[#888] mb-1 block">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none">
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#888] mb-1 block">
                    Max Members
                  </label>
                  <input
                    type="number"
                    defaultValue={20}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-[#888]">
                  <input
                    type="radio"
                    name="visibility"
                    defaultChecked
                    className="text-indigo-500"
                  />
                  <Globe className="w-4 h-4" />
                  Public
                </label>
                <label className="flex items-center gap-2 text-sm text-[#888]">
                  <input
                    type="radio"
                    name="visibility"
                    className="text-indigo-500"
                  />
                  <Lock className="w-4 h-4" />
                  Private
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-white/5 text-[#888] rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
