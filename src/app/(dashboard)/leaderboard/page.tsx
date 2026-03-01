"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Trophy, Zap, Medal, Crown, Flame, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEloLevel } from "@/lib/utils";

interface LeaderboardUser {
  _id: string;
  name: string;
  image?: string;
  eloRating: number;
  totalSessions: number;
  currentStreak: number;
  badges: string[];
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<"all" | "weekly" | "monthly">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/leaderboard?period=${period}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const filtered = users.filter(
    (u) => !search || u.name.toLowerCase().includes(search.toLowerCase()),
  );
  const currentUserId = session?.user?.id;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-[#ccc]" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return (
      <span className="text-sm font-semibold text-[#888] w-5 text-center">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter bg-[#080808]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Leaderboard</h1>
        <p className="text-[#888]">
          Compete with developers worldwide. Climb the ELO rankings.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "weekly", "monthly"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p === "all" ? "All Time" : p}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {filtered.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {[1, 0, 2].map((pos) => {
            const u = filtered[pos];
            if (!u) return null;
            const level = getEloLevel(u.eloRating);
            const isCenter = pos === 0;
            return (
              <Card
                key={u._id}
                className={`bg-[#111] border-white/6 ${isCenter ? "ring-2 ring-yellow-500/30 -mt-4" : ""}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-3">{getRankIcon(pos)}</div>
                  <Avatar
                    className={`mx-auto mb-3 ${isCenter ? "w-16 h-16" : "w-12 h-12"}`}
                  >
                    <AvatarImage src={u.image} />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {u.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold truncate">{u.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <span className="text-lg font-bold text-indigo-400">
                      {u.eloRating}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-2 text-[10px]"
                    style={{
                      color: level.color,
                      borderColor: level.color + "40",
                    }}
                  >
                    {level.name}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      {/* Full rankings */}
      <Card className="bg-[#111] border-white/6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" /> Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-[#888] mx-auto mb-4" />
              <p className="text-[#888]">
                No users found. Complete interviews to join the leaderboard!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((u, i) => {
                const level = getEloLevel(u.eloRating);
                const isMe = u._id === currentUserId;
                return (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${isMe ? "bg-indigo-500/10 border border-indigo-500/20" : "hover:bg-white/4"}`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(i)}
                    </div>
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={u.image} />
                      <AvatarFallback className="text-xs bg-indigo-600 text-white">
                        {u.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{u.name}</span>
                        {isMe && (
                          <Badge className="text-[10px] bg-indigo-500/20 text-indigo-400">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-[#888]">
                        {u.totalSessions} sessions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span
                          className="font-bold"
                          style={{ color: level.color }}
                        >
                          {u.eloRating}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#888]">
                        {level.name}
                      </div>
                    </div>
                    {u.currentStreak >= 7 && (
                      <Flame className="w-4 h-4 text-orange-400 streak-fire" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
