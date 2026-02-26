import connectDB from "../lib/mongodb";
import Question from "../models/Question";

const questions = [
  // ===== DSA - Easy =====
  {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
    difficulty: "easy",
    category: "array",
    companies: ["google", "amazon", "meta", "apple"],
    frequency: 9,
    timeLimit: 20,
    hints: [
      "Think about what you need to find for each element",
      "Could you use a hash map to store complements?",
      "For each num, check if (target - num) exists in your map",
    ],
    solutionApproaches: ["Hash Map — O(n) time, O(n) space", "Brute Force — O(n²) time, O(1) space"],
    tags: ["array", "hash-map", "beginner-friendly"],
  },
  {
    title: "Valid Parentheses",
    description:
      "Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed in the correct order.",
    difficulty: "easy",
    category: "string",
    companies: ["amazon", "microsoft", "google"],
    frequency: 8,
    timeLimit: 15,
    hints: [
      "Stack is perfect for matching pairs",
      "Push on open bracket, pop on close bracket",
      "At the end, the stack should be empty",
    ],
    solutionApproaches: ["Stack — O(n) time, O(n) space"],
    tags: ["stack", "string"],
  },
  {
    title: "Merge Two Sorted Lists",
    description:
      "You are given the heads of two sorted linked lists. Merge the two lists into one sorted list by splicing together the nodes.",
    difficulty: "easy",
    category: "linkedlist",
    companies: ["amazon", "apple", "microsoft"],
    frequency: 8,
    timeLimit: 15,
    hints: [
      "Use a dummy head to simplify the merge",
      "Compare heads of both lists and pick the smaller one",
      "Don't forget to append the remaining list",
    ],
    solutionApproaches: ["Iterative merge — O(n+m) time", "Recursive — O(n+m) time"],
    tags: ["linked-list", "two-pointer"],
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy and a single day to sell.",
    difficulty: "easy",
    category: "array",
    companies: ["amazon", "meta", "google", "microsoft"],
    frequency: 9,
    timeLimit: 15,
    hints: [
      "Track the minimum price seen so far",
      "At each day, calculate profit if you sold today",
      "Keep the maximum profit across all days",
    ],
    solutionApproaches: ["Single pass — O(n) time, O(1) space"],
    tags: ["array", "greedy", "dynamic-programming"],
  },

  // ===== DSA - Medium =====
  {
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    category: "string",
    companies: ["amazon", "meta", "google", "stripe"],
    frequency: 9,
    timeLimit: 25,
    hints: [
      "Sliding window technique",
      "Use a set to track characters in the current window",
      "Expand right, shrink left on duplicate",
    ],
    solutionApproaches: ["Sliding Window + Set — O(n)", "Sliding Window + Map — O(n)"],
    tags: ["sliding-window", "string", "hash-set"],
  },
  {
    title: "LRU Cache",
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get() and put() in O(1) time.",
    difficulty: "medium",
    category: "design",
    companies: ["amazon", "google", "meta", "microsoft"],
    frequency: 8,
    timeLimit: 35,
    hints: [
      "HashMap + Doubly Linked List",
      "O(1) for both get and put",
      "Move accessed items to front of list",
    ],
    solutionApproaches: ["HashMap + Doubly Linked List — O(1) get/put"],
    tags: ["design", "linked-list", "hash-map"],
  },
  {
    title: "3Sum",
    description:
      "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "medium",
    category: "array",
    companies: ["amazon", "google", "meta", "apple"],
    frequency: 9,
    timeLimit: 30,
    hints: [
      "Sort the array first",
      "Fix one element and use two pointers for the rest",
      "Skip duplicates to avoid repeated triplets",
    ],
    solutionApproaches: ["Sort + Two Pointers — O(n²)", "Hash Set approach — O(n²)"],
    tags: ["array", "two-pointer", "sorting"],
  },
  {
    title: "Binary Tree Level Order Traversal",
    description:
      "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    difficulty: "medium",
    category: "tree",
    companies: ["meta", "amazon", "microsoft"],
    frequency: 7,
    timeLimit: 20,
    hints: [
      "Use a queue (BFS)",
      "Process all nodes at one level before moving to the next",
      "Track the size of the queue at each level",
    ],
    solutionApproaches: ["BFS with Queue — O(n)", "DFS with depth tracking — O(n)"],
    tags: ["tree", "bfs", "queue"],
  },

  // ===== DSA - Hard =====
  {
    title: "Median of Two Sorted Arrays",
    description:
      "Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    difficulty: "hard",
    category: "array",
    companies: ["google", "amazon", "apple"],
    frequency: 7,
    timeLimit: 45,
    hints: [
      "Think binary search, not merging",
      "Partition both arrays at the right point",
      "The smaller array should be the one you binary search on",
    ],
    solutionApproaches: ["Binary Search — O(log(min(m,n)))"],
    tags: ["array", "binary-search", "divide-and-conquer"],
  },

  // ===== System Design =====
  {
    title: "Design URL Shortener (like bit.ly)",
    description:
      "Design a URL shortening service. Cover: API design, database schema, hash generation, redirect mechanism, and scaling strategies.",
    difficulty: "medium",
    category: "system_design",
    companies: ["google", "amazon", "meta"],
    frequency: 9,
    timeLimit: 45,
    hints: [
      "Start with requirements: scale, latency, storage",
      "Consider Base62 encoding for short codes",
      "Think about read-heavy vs write-heavy and caching",
    ],
    solutionApproaches: ["Base62 encoding + NoSQL", "Counter-based + SQL"],
    tags: ["system-design", "hashing", "databases"],
  },
  {
    title: "Design Twitter/X Feed",
    description:
      "Design a simplified Twitter. Cover: posting tweets, following users, and generating a home timeline. Discuss fan-out strategies.",
    difficulty: "hard",
    category: "system_design",
    companies: ["meta", "google", "twitter"],
    frequency: 8,
    timeLimit: 60,
    hints: [
      "Fan-out on write vs fan-out on read",
      "Consider celebrity users (hot spots)",
      "Redis for timeline caching, Kafka for async processing",
    ],
    solutionApproaches: ["Hybrid fan-out approach"],
    tags: ["system-design", "social-media", "caching"],
  },
  {
    title: "Design a Chat System (like WhatsApp)",
    description:
      "Design a real-time messaging system. Cover: 1:1 chats, group chats, message delivery guarantees, read receipts, and media sharing.",
    difficulty: "hard",
    category: "system_design",
    companies: ["meta", "google", "microsoft"],
    frequency: 8,
    timeLimit: 60,
    hints: [
      "WebSockets for real-time communication",
      "Message queue for reliability",
      "Consider offline message storage and sync",
    ],
    solutionApproaches: ["WebSocket + Message Queue + NoSQL"],
    tags: ["system-design", "real-time", "messaging"],
  },

  // ===== Behavioral =====
  {
    title: "Tell me about a time you disagreed with your manager",
    description:
      "Use the STAR method: Situation, Task, Action, Result. Show you can disagree professionally and reach good outcomes.",
    difficulty: "medium",
    category: "behavioral",
    companies: ["amazon", "google", "meta", "microsoft"],
    frequency: 9,
    timeLimit: 10,
    hints: [
      "Focus on the outcome being positive",
      "Show respectful disagreement with data",
      "Emphasize the reasoning you used",
    ],
    solutionApproaches: ["STAR method"],
    tags: ["behavioral", "leadership", "conflict"],
  },
  {
    title: "Describe your biggest technical failure",
    description:
      "Talk about a significant technical mistake. What happened, what you learned, and how you prevented it from recurring.",
    difficulty: "easy",
    category: "behavioral",
    companies: ["amazon", "stripe", "shopify"],
    frequency: 8,
    timeLimit: 10,
    hints: [
      "Be honest — interviewers respect self-awareness",
      "Focus heavily on learnings",
      "Show what systems/processes you put in place after",
    ],
    solutionApproaches: ["STAR method with emphasis on growth"],
    tags: ["behavioral", "growth", "reflection"],
  },
  {
    title: "Tell me about a project you're most proud of",
    description:
      "Discuss a project showcasing your technical skills, impact, and ownership. Quantify results where possible.",
    difficulty: "easy",
    category: "behavioral",
    companies: ["google", "meta", "amazon", "apple", "microsoft"],
    frequency: 9,
    timeLimit: 10,
    hints: [
      "Pick a project with measurable impact",
      "Explain your specific contributions clearly",
      "Discuss trade-offs and decisions you made",
    ],
    solutionApproaches: ["STAR method with metrics"],
    tags: ["behavioral", "impact", "ownership"],
  },

  // ===== Frontend =====
  {
    title: "Implement Debounce Function",
    description:
      "Write a debounce function that limits the rate at which a function fires. Explain when you would use debounce vs throttle.",
    difficulty: "medium",
    category: "frontend",
    companies: ["google", "meta", "amazon"],
    frequency: 7,
    timeLimit: 20,
    hints: [
      "Use setTimeout and clearTimeout",
      "Return a new function that wraps the original",
      "Clear the previous timer on each call",
    ],
    solutionApproaches: ["Closure + setTimeout — O(1)"],
    tags: ["frontend", "javascript", "closures"],
  },

  // ===== Backend =====
  {
    title: "Design a Rate Limiter",
    description:
      "Design a rate limiter that can be used in an API gateway. Discuss token bucket, sliding window, and fixed window algorithms.",
    difficulty: "medium",
    category: "backend",
    companies: ["stripe", "amazon", "google"],
    frequency: 8,
    timeLimit: 35,
    hints: [
      "Compare token bucket vs sliding window",
      "Consider distributed rate limiting with Redis",
      "Think about different granularity levels (user, IP, API key)",
    ],
    solutionApproaches: [
      "Token Bucket",
      "Sliding Window Counter",
      "Fixed Window with Redis",
    ],
    tags: ["backend", "rate-limiting", "system-design"],
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    await Question.deleteMany({});
    console.log("Cleared existing questions");

    await Question.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} questions successfully!`);

    console.log("\nBreakdown:");
    const categories = [...new Set(questions.map((q) => q.category))];
    for (const cat of categories) {
      const count = questions.filter((q) => q.category === cat).length;
      console.log(`  ${cat}: ${count} questions`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
