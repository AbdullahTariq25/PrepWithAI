import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

// Auto-seed 20 questions if the collection is empty
async function ensureQuestions() {
  const count = await Question.countDocuments();
  if (count > 0) return;

  const seedQuestions = [
    { title: "Two Sum", category: "dsa", subcategory: "arrays", difficulty: "easy", description: "Given an array of integers and a target, return indices of two numbers that add up to target.", tags: ["array", "hash-map"], company: "google", timeLimit: 15, successRate: 78 },
    { title: "Reverse Linked List", category: "dsa", subcategory: "linked-lists", difficulty: "easy", description: "Reverse a singly linked list iteratively and recursively.", tags: ["linked-list", "recursion"], company: "meta", timeLimit: 15, successRate: 72 },
    { title: "Valid Parentheses", category: "dsa", subcategory: "stacks", difficulty: "easy", description: "Determine if input string has valid open/close bracket ordering.", tags: ["stack", "string"], company: "amazon", timeLimit: 10, successRate: 80 },
    { title: "Binary Search", category: "dsa", subcategory: "searching", difficulty: "easy", description: "Implement binary search on a sorted array.", tags: ["array", "binary-search"], company: "microsoft", timeLimit: 10, successRate: 85 },
    { title: "Maximum Subarray (Kadane)", category: "dsa", subcategory: "dynamic-programming", difficulty: "medium", description: "Find the contiguous subarray with the largest sum.", tags: ["array", "dp", "divide-and-conquer"], company: "google", timeLimit: 20, successRate: 60 },
    { title: "LRU Cache", category: "dsa", subcategory: "design", difficulty: "medium", description: "Design and implement an LRU cache with O(1) get and put.", tags: ["hash-map", "linked-list", "design"], company: "meta", timeLimit: 30, successRate: 45 },
    { title: "Course Schedule (Topological Sort)", category: "dsa", subcategory: "graphs", difficulty: "medium", description: "Determine if you can finish all courses given prerequisites.", tags: ["graph", "topological-sort", "bfs"], company: "amazon", timeLimit: 25, successRate: 55 },
    { title: "3Sum", category: "dsa", subcategory: "arrays", difficulty: "medium", description: "Find all unique triplets in the array that sum to zero.", tags: ["array", "two-pointers", "sorting"], company: "apple", timeLimit: 25, successRate: 50 },
    { title: "Merge Intervals", category: "dsa", subcategory: "intervals", difficulty: "medium", description: "Merge all overlapping intervals.", tags: ["array", "sorting", "intervals"], company: "google", timeLimit: 20, successRate: 58 },
    { title: "Word Break", category: "dsa", subcategory: "dynamic-programming", difficulty: "medium", description: "Determine if a string can be segmented into dictionary words.", tags: ["dp", "string", "hash-set"], company: "meta", timeLimit: 25, successRate: 48 },
    { title: "Serialize and Deserialize Binary Tree", category: "dsa", subcategory: "trees", difficulty: "hard", description: "Design an algorithm to serialize and deserialize a binary tree.", tags: ["tree", "bfs", "dfs", "design"], company: "google", timeLimit: 30, successRate: 35 },
    { title: "Median of Two Sorted Arrays", category: "dsa", subcategory: "binary-search", difficulty: "hard", description: "Find the median of two sorted arrays in O(log(m+n)).", tags: ["array", "binary-search", "divide-and-conquer"], company: "amazon", timeLimit: 30, successRate: 28 },
    { title: "Design a URL Shortener", category: "system-design", subcategory: "web-systems", difficulty: "medium", description: "Design a system like bit.ly — generate short URLs, redirect, handle scale.", tags: ["system-design", "hashing", "database"], company: "meta", timeLimit: 45, successRate: 55 },
    { title: "Design a Chat System", category: "system-design", subcategory: "real-time", difficulty: "hard", description: "Design WhatsApp/Slack — messaging, presence, groups, media.", tags: ["system-design", "websocket", "pub-sub"], company: "meta", timeLimit: 45, successRate: 38 },
    { title: "Tell Me About a Time You Failed", category: "behavioral", subcategory: "self-awareness", difficulty: "medium", description: "Describe a significant failure and what you learned from it.", tags: ["behavioral", "star-method", "failure"], company: "general", timeLimit: 10, successRate: 70 },
    { title: "Describe a Conflict with a Teammate", category: "behavioral", subcategory: "collaboration", difficulty: "medium", description: "Share how you handled a disagreement with a colleague.", tags: ["behavioral", "conflict", "teamwork"], company: "amazon", timeLimit: 10, successRate: 65 },
    { title: "React Rendering Optimization", category: "frontend", subcategory: "react", difficulty: "medium", description: "Explain React.memo, useMemo, useCallback and when to use them.", tags: ["react", "performance", "hooks"], company: "meta", timeLimit: 20, successRate: 55 },
    { title: "REST vs GraphQL API Design", category: "backend", subcategory: "api-design", difficulty: "medium", description: "Compare REST and GraphQL. When would you use each?", tags: ["api", "rest", "graphql"], company: "netflix", timeLimit: 20, successRate: 60 },
    { title: "CI/CD Pipeline Design", category: "devops", subcategory: "automation", difficulty: "medium", description: "Design a CI/CD pipeline for a microservices application.", tags: ["devops", "ci-cd", "docker", "kubernetes"], company: "google", timeLimit: 30, successRate: 50 },
    { title: "Implement a Rate Limiter", category: "dsa", subcategory: "design", difficulty: "medium", description: "Design and implement a rate limiter using token bucket or sliding window.", tags: ["design", "system-design", "algorithm"], company: "stripe", timeLimit: 25, successRate: 42 },
  ];

  await Question.insertMany(seedQuestions);
  console.log("✅ Seeded 20 questions into the database");
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "";
    const difficulty = url.searchParams.get("difficulty") || "";
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);

    await connectDB();
    await ensureQuestions();

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title category subcategory difficulty tags company successRate solvedCount")
        .lean(),
      Question.countDocuments(filter),
    ]);

    return NextResponse.json({
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Questions error:", error);
    return NextResponse.json(
      { error: "Failed to get questions" },
      { status: 500 }
    );
  }
}
