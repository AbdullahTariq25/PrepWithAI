// ===========================================
// PrepWithAI — Questions Route
// GET /api/questions
// Returns filtered, paginated questions
// Auto-seeds 50 questions if empty
// Built by Abdullah Tariq, Lahore Pakistan
// ===========================================

import { NextRequest } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { questionsQuerySchema, validateQuery } from "@/lib/validation";
import { success, badRequest, serverError } from "@/lib/response";
import Question from "@/models/Question";

// ─── Seed 50 Questions ──────────────────────────────

async function ensureQuestions(): Promise<void> {
  const count = await Question.countDocuments();
  if (count > 0) return;

  const seedQuestions = [
    // DSA — Easy (8)
    { title: "Two Sum", category: "dsa", subcategory: "arrays", difficulty: "easy", description: "Given an array of integers and a target, return indices of two numbers that add up to target.", tags: ["array", "hash-map"], companies: ["google", "amazon", "meta"], timeLimit: 15, successRate: 78, hints: ["Think about what complement you need for each number.", "A hash map can give O(1) lookup."], examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" }] },
    { title: "Reverse Linked List", category: "dsa", subcategory: "linked-lists", difficulty: "easy", description: "Reverse a singly linked list iteratively and recursively.", tags: ["linked-list", "recursion"], companies: ["meta", "microsoft"], timeLimit: 15, successRate: 72, hints: ["Use three pointers: prev, current, next.", "For recursion, what's the base case?"] },
    { title: "Valid Parentheses", category: "dsa", subcategory: "stacks", difficulty: "easy", description: "Determine if input string has valid open/close bracket ordering.", tags: ["stack", "string"], companies: ["amazon", "bloomberg"], timeLimit: 10, successRate: 80, hints: ["Use a stack to track opening brackets.", "When you see a closing bracket, what should be on top?"] },
    { title: "Binary Search", category: "dsa", subcategory: "searching", difficulty: "easy", description: "Implement binary search on a sorted array.", tags: ["array", "binary-search"], companies: ["microsoft", "google"], timeLimit: 10, successRate: 85, hints: ["Compare target with middle element.", "How do you handle left and right pointers?"] },
    { title: "Merge Two Sorted Lists", category: "dsa", subcategory: "linked-lists", difficulty: "easy", description: "Merge two sorted linked lists into one sorted list.", tags: ["linked-list", "recursion"], companies: ["amazon", "apple"], timeLimit: 15, successRate: 75, hints: ["Use a dummy node to simplify the merge.", "Compare heads of both lists at each step."] },
    { title: "Best Time to Buy and Sell Stock", category: "dsa", subcategory: "arrays", difficulty: "easy", description: "Find the maximum profit from buying and selling a stock once.", tags: ["array", "greedy"], companies: ["amazon", "meta", "goldman-sachs"], timeLimit: 10, successRate: 82, hints: ["Track the minimum price seen so far.", "At each step, calculate potential profit."] },
    { title: "Contains Duplicate", category: "dsa", subcategory: "arrays", difficulty: "easy", description: "Check if array contains any duplicates.", tags: ["array", "hash-set"], companies: ["apple", "microsoft"], timeLimit: 10, successRate: 88, hints: ["A Set stores only unique values.", "Compare Set size with array length."] },
    { title: "Valid Anagram", category: "dsa", subcategory: "strings", difficulty: "easy", description: "Determine if two strings are anagrams of each other.", tags: ["string", "hash-map", "sorting"], companies: ["google", "uber"], timeLimit: 10, successRate: 84, hints: ["Count character frequencies.", "Two anagrams have identical frequency maps."] },

    // DSA — Medium (12)
    { title: "Maximum Subarray (Kadane's)", category: "dsa", subcategory: "dynamic-programming", difficulty: "medium", description: "Find the contiguous subarray with the largest sum.", tags: ["array", "dp", "divide-and-conquer"], companies: ["google", "amazon"], timeLimit: 20, successRate: 60, hints: ["At each position, decide: extend or start fresh.", "Track both current sum and global max."] },
    { title: "LRU Cache", category: "dsa", subcategory: "design", difficulty: "medium", description: "Design and implement an LRU cache with O(1) get and put.", tags: ["hash-map", "linked-list", "design"], companies: ["meta", "amazon", "microsoft"], timeLimit: 30, successRate: 45, hints: ["Combine a hash map with a doubly linked list.", "Most recently used goes to the front."] },
    { title: "Course Schedule (Topological Sort)", category: "dsa", subcategory: "graphs", difficulty: "medium", description: "Determine if you can finish all courses given prerequisites (cycle detection).", tags: ["graph", "topological-sort", "bfs"], companies: ["amazon", "google"], timeLimit: 25, successRate: 55, hints: ["Model courses as a directed graph.", "Detect cycles using BFS (Kahn's) or DFS."] },
    { title: "3Sum", category: "dsa", subcategory: "arrays", difficulty: "medium", description: "Find all unique triplets in the array that sum to zero.", tags: ["array", "two-pointers", "sorting"], companies: ["apple", "meta", "amazon"], timeLimit: 25, successRate: 50, hints: ["Sort the array first.", "Fix one element, then use two pointers for the other two."] },
    { title: "Merge Intervals", category: "dsa", subcategory: "intervals", difficulty: "medium", description: "Merge all overlapping intervals in a collection.", tags: ["array", "sorting", "intervals"], companies: ["google", "meta", "bloomberg"], timeLimit: 20, successRate: 58, hints: ["Sort intervals by start time.", "Merge if current start ≤ previous end."] },
    { title: "Word Break", category: "dsa", subcategory: "dynamic-programming", difficulty: "medium", description: "Determine if a string can be segmented into dictionary words.", tags: ["dp", "string", "hash-set"], companies: ["meta", "amazon", "apple"], timeLimit: 25, successRate: 48, hints: ["Use DP: dp[i] = can s[0..i] be segmented?", "For each position, check all possible word endings."] },
    { title: "Number of Islands", category: "dsa", subcategory: "graphs", difficulty: "medium", description: "Count the number of islands in a 2D grid of '1's and '0's.", tags: ["graph", "bfs", "dfs", "matrix"], companies: ["amazon", "google", "microsoft"], timeLimit: 20, successRate: 62, hints: ["Use DFS/BFS to flood-fill each island.", "Mark visited cells to avoid double counting."] },
    { title: "Product of Array Except Self", category: "dsa", subcategory: "arrays", difficulty: "medium", description: "Return array where each element is product of all others, without division.", tags: ["array", "prefix-sum"], companies: ["amazon", "apple", "meta"], timeLimit: 20, successRate: 55, hints: ["Use prefix products from left and right.", "Multiply left[i] * right[i] for the answer."] },
    { title: "Coin Change", category: "dsa", subcategory: "dynamic-programming", difficulty: "medium", description: "Find the minimum number of coins to make a given amount.", tags: ["dp", "greedy"], companies: ["amazon", "google"], timeLimit: 25, successRate: 52, hints: ["Use bottom-up DP with dp[amount].", "For each coin, update dp[i] = min(dp[i], dp[i-coin] + 1)."] },
    { title: "Validate Binary Search Tree", category: "dsa", subcategory: "trees", difficulty: "medium", description: "Determine if a binary tree is a valid BST.", tags: ["tree", "dfs", "recursion"], companies: ["meta", "amazon"], timeLimit: 20, successRate: 58, hints: ["Pass min/max bounds to each recursive call.", "In-order traversal should be strictly increasing."] },
    { title: "Group Anagrams", category: "dsa", subcategory: "strings", difficulty: "medium", description: "Group strings that are anagrams of each other.", tags: ["string", "hash-map", "sorting"], companies: ["amazon", "google", "meta"], timeLimit: 20, successRate: 60, hints: ["Sort each string to create a key.", "Use a hash map to group by sorted key."] },
    { title: "Implement a Rate Limiter", category: "dsa", subcategory: "design", difficulty: "medium", description: "Design and implement a rate limiter using token bucket or sliding window.", tags: ["design", "system-design", "algorithm"], companies: ["stripe", "uber", "google"], timeLimit: 25, successRate: 42, hints: ["Token bucket: refill tokens at fixed rate.", "Sliding window: track timestamps within the window."] },

    // DSA — Hard (5)
    { title: "Serialize and Deserialize Binary Tree", category: "dsa", subcategory: "trees", difficulty: "hard", description: "Design an algorithm to serialize and deserialize a binary tree.", tags: ["tree", "bfs", "dfs", "design"], companies: ["google", "meta", "amazon"], timeLimit: 30, successRate: 35, hints: ["Use pre-order traversal with null markers.", "BFS level-order also works well."] },
    { title: "Median of Two Sorted Arrays", category: "dsa", subcategory: "binary-search", difficulty: "hard", description: "Find the median of two sorted arrays in O(log(m+n)).", tags: ["array", "binary-search", "divide-and-conquer"], companies: ["amazon", "google", "apple"], timeLimit: 30, successRate: 28, hints: ["Binary search on the shorter array.", "Partition both arrays so left half has correct elements."] },
    { title: "Trapping Rain Water", category: "dsa", subcategory: "arrays", difficulty: "hard", description: "Calculate how much water can be trapped between bars.", tags: ["array", "two-pointers", "stack", "dp"], companies: ["amazon", "google", "meta"], timeLimit: 25, successRate: 38, hints: ["For each bar, water = min(maxLeft, maxRight) - height.", "Two pointer approach avoids extra space."] },
    { title: "Alien Dictionary", category: "dsa", subcategory: "graphs", difficulty: "hard", description: "Derive the order of characters in an alien language from a sorted dictionary.", tags: ["graph", "topological-sort"], companies: ["meta", "google", "airbnb"], timeLimit: 30, successRate: 32, hints: ["Compare adjacent words to find character ordering.", "Build a graph and do topological sort."] },
    { title: "Word Ladder", category: "dsa", subcategory: "graphs", difficulty: "hard", description: "Find shortest transformation sequence from beginWord to endWord.", tags: ["bfs", "graph", "string"], companies: ["amazon", "meta", "google"], timeLimit: 30, successRate: 30, hints: ["BFS gives shortest path in unweighted graph.", "For each word, try changing one letter at a time."] },

    // System Design (8)
    { title: "Design a URL Shortener", category: "system-design", subcategory: "web-systems", difficulty: "medium", description: "Design a system like bit.ly — generate short URLs, redirect, handle scale.", tags: ["system-design", "hashing", "database"], companies: ["meta", "google"], timeLimit: 45, successRate: 55, hints: ["Consider base62 encoding for short codes.", "How do you handle collisions?"] },
    { title: "Design a Chat System", category: "system-design", subcategory: "real-time", difficulty: "hard", description: "Design WhatsApp/Slack — messaging, presence, groups, media.", tags: ["system-design", "websocket", "pub-sub"], companies: ["meta", "google", "microsoft"], timeLimit: 45, successRate: 38, hints: ["WebSockets for real-time delivery.", "Consider message ordering and delivery guarantees."] },
    { title: "Design a News Feed", category: "system-design", subcategory: "social", difficulty: "medium", description: "Design Facebook/Twitter news feed — ranking, caching, real-time updates.", tags: ["system-design", "caching", "ranking"], companies: ["meta", "twitter"], timeLimit: 45, successRate: 48, hints: ["Push vs pull model for feed generation.", "Pre-compute feeds for active users."] },
    { title: "Design a Distributed Cache", category: "system-design", subcategory: "infrastructure", difficulty: "hard", description: "Design a system like Redis/Memcached — partitioning, replication, consistency.", tags: ["system-design", "caching", "distributed-systems"], companies: ["amazon", "google", "microsoft"], timeLimit: 45, successRate: 35, hints: ["Consistent hashing for partitioning.", "Consider cache eviction policies."] },
    { title: "Design an E-commerce Platform", category: "system-design", subcategory: "web-systems", difficulty: "medium", description: "Design Amazon — product catalog, cart, checkout, inventory, search.", tags: ["system-design", "microservices", "database"], companies: ["amazon", "shopify"], timeLimit: 45, successRate: 50, hints: ["Separate read and write paths.", "How do you handle inventory during checkout?"] },
    { title: "Design a Ride-Sharing Service", category: "system-design", subcategory: "location-based", difficulty: "hard", description: "Design Uber/Lyft — matching, real-time location, surge pricing.", tags: ["system-design", "geospatial", "real-time"], companies: ["uber", "lyft", "google"], timeLimit: 45, successRate: 35, hints: ["Geospatial indexing for nearby drivers.", "Consider the matching algorithm."] },
    { title: "Design a Video Streaming Platform", category: "system-design", subcategory: "media", difficulty: "hard", description: "Design YouTube/Netflix — upload, transcode, CDN, recommendations.", tags: ["system-design", "cdn", "media-processing"], companies: ["netflix", "google", "amazon"], timeLimit: 45, successRate: 32, hints: ["Adaptive bitrate streaming (HLS/DASH).", "CDN placement strategy for global delivery."] },
    { title: "Design a Search Autocomplete", category: "system-design", subcategory: "search", difficulty: "medium", description: "Design Google search autocomplete — trie, ranking, personalization.", tags: ["system-design", "trie", "ranking"], companies: ["google", "amazon", "microsoft"], timeLimit: 40, successRate: 52, hints: ["Trie for prefix matching.", "Rank by frequency, recency, and personalization."] },

    // Behavioral (7)
    { title: "Tell Me About a Time You Failed", category: "behavioral", subcategory: "self-awareness", difficulty: "medium", description: "Describe a significant failure and what you learned from it.", tags: ["behavioral", "star-method", "failure"], companies: ["general"], timeLimit: 10, successRate: 70, hints: ["Use STAR method: Situation, Task, Action, Result.", "Focus on what you learned, not the failure itself."] },
    { title: "Describe a Conflict with a Teammate", category: "behavioral", subcategory: "collaboration", difficulty: "medium", description: "Share how you handled a disagreement with a colleague.", tags: ["behavioral", "conflict", "teamwork"], companies: ["amazon", "google"], timeLimit: 10, successRate: 65, hints: ["Show empathy and active listening.", "Focus on resolution, not blame."] },
    { title: "Tell Me About Your Biggest Achievement", category: "behavioral", subcategory: "impact", difficulty: "easy", description: "Describe your most significant professional achievement.", tags: ["behavioral", "star-method", "impact"], companies: ["general"], timeLimit: 10, successRate: 75, hints: ["Quantify your impact with metrics.", "Explain your specific role clearly."] },
    { title: "How Do You Handle Tight Deadlines?", category: "behavioral", subcategory: "time-management", difficulty: "medium", description: "Describe how you manage work under time pressure.", tags: ["behavioral", "time-management", "prioritization"], companies: ["amazon", "meta"], timeLimit: 10, successRate: 68, hints: ["Prioritization frameworks (MoSCoW, Eisenhower).", "Communicate early about risks."] },
    { title: "Describe a Time You Showed Leadership", category: "behavioral", subcategory: "leadership", difficulty: "medium", description: "Share an example of when you led a team or initiative.", tags: ["behavioral", "leadership", "influence"], companies: ["google", "amazon", "meta"], timeLimit: 10, successRate: 62, hints: ["Leadership doesn't require a title.", "Focus on influence and outcomes."] },
    { title: "Why Do You Want to Work Here?", category: "behavioral", subcategory: "motivation", difficulty: "easy", description: "Explain your motivation for joining the specific company.", tags: ["behavioral", "motivation", "culture-fit"], companies: ["general"], timeLimit: 8, successRate: 78, hints: ["Research the company's mission and values.", "Connect your goals with the company's direction."] },
    { title: "Tell Me About a Complex Technical Decision", category: "behavioral", subcategory: "technical-decision", difficulty: "hard", description: "Describe a difficult technical decision you made and its outcome.", tags: ["behavioral", "decision-making", "technical"], companies: ["google", "meta", "netflix"], timeLimit: 12, successRate: 48, hints: ["Explain the trade-offs you considered.", "Discuss how you evaluated alternatives."] },

    // Frontend (5)
    { title: "React Rendering Optimization", category: "frontend", subcategory: "react", difficulty: "medium", description: "Explain React.memo, useMemo, useCallback and when to use them for performance.", tags: ["react", "performance", "hooks"], companies: ["meta", "netflix"], timeLimit: 20, successRate: 55, hints: ["React.memo for component-level memoization.", "useMemo for expensive computations, useCallback for stable function references."] },
    { title: "Build an Accessible Modal Component", category: "frontend", subcategory: "accessibility", difficulty: "medium", description: "Implement a modal dialog that follows WAI-ARIA best practices.", tags: ["react", "accessibility", "a11y"], companies: ["microsoft", "google"], timeLimit: 25, successRate: 48, hints: ["Trap focus inside the modal.", "Use aria-modal, role=dialog, aria-labelledby."] },
    { title: "CSS Grid vs Flexbox Layout", category: "frontend", subcategory: "css", difficulty: "easy", description: "Compare CSS Grid and Flexbox, explain when to use each.", tags: ["css", "layout", "responsive"], companies: ["meta", "shopify"], timeLimit: 15, successRate: 72, hints: ["Flexbox is one-dimensional, Grid is two-dimensional.", "Grid for page layout, Flexbox for component layout."] },
    { title: "Implement Virtual Scrolling", category: "frontend", subcategory: "performance", difficulty: "hard", description: "Build a virtualized list that efficiently renders 100K+ items.", tags: ["react", "performance", "virtualization"], companies: ["meta", "google", "bloomberg"], timeLimit: 30, successRate: 32, hints: ["Only render visible items + buffer.", "Calculate scroll position to determine visible range."] },
    { title: "State Management Patterns", category: "frontend", subcategory: "architecture", difficulty: "medium", description: "Compare Redux, Zustand, Context API, Jotai — when to use what.", tags: ["react", "state-management", "architecture"], companies: ["meta", "netflix", "uber"], timeLimit: 20, successRate: 55, hints: ["Consider: app size, team size, and complexity.", "Server state vs client state (React Query/SWR)."] },

    // Backend (5)
    { title: "REST vs GraphQL API Design", category: "backend", subcategory: "api-design", difficulty: "medium", description: "Compare REST and GraphQL. Design an API for a social media app.", tags: ["api", "rest", "graphql"], companies: ["netflix", "meta", "shopify"], timeLimit: 20, successRate: 60, hints: ["REST: resource-oriented, GraphQL: query-oriented.", "Consider over-fetching and under-fetching."] },
    { title: "Database Indexing Strategy", category: "backend", subcategory: "databases", difficulty: "medium", description: "Design an indexing strategy for a high-traffic e-commerce search.", tags: ["database", "indexing", "performance"], companies: ["amazon", "google"], timeLimit: 25, successRate: 48, hints: ["Composite indexes for common query patterns.", "Consider covering indexes to avoid table lookups."] },
    { title: "Authentication and Authorization Architecture", category: "backend", subcategory: "security", difficulty: "hard", description: "Design a comprehensive auth system with JWT, refresh tokens, RBAC.", tags: ["security", "jwt", "oauth"], companies: ["google", "amazon", "stripe"], timeLimit: 30, successRate: 38, hints: ["Short-lived access tokens + long-lived refresh tokens.", "Store refresh tokens securely, implement rotation."] },
    { title: "Microservices Communication Patterns", category: "backend", subcategory: "architecture", difficulty: "medium", description: "Compare sync vs async communication in microservices architecture.", tags: ["microservices", "architecture", "messaging"], companies: ["amazon", "uber", "netflix"], timeLimit: 25, successRate: 52, hints: ["Sync: REST/gRPC. Async: message queues/events.", "Consider eventual consistency and saga pattern."] },
    { title: "CI/CD Pipeline Design", category: "devops", subcategory: "automation", difficulty: "medium", description: "Design a CI/CD pipeline for a microservices application.", tags: ["devops", "ci-cd", "docker", "kubernetes"], companies: ["google", "amazon", "microsoft"], timeLimit: 30, successRate: 50, hints: ["Stages: lint, test, build, deploy, verify.", "Consider canary deployments and rollback strategy."] },
  ];

  await Question.insertMany(seedQuestions);
  console.log("✅ Seeded 50 questions into the database");
}

// ─── GET Handler ─────────────────────────────────────

async function handler(req: NextRequest) {
  try {
    const { data, error } = validateQuery(req.url, questionsQuerySchema);
    if (error || !data) {
      return badRequest(error || "Invalid query");
    }

    await ensureQuestions();

    const { category, difficulty, search, page, limit, company, tags } = data;

    // Build filter
    const filter: Record<string, unknown> = { isActive: { $ne: false } };
    if (category) filter.category = category.toLowerCase();
    if (difficulty) filter.difficulty = difficulty;
    if (company) filter.companies = company.toLowerCase();
    if (tags) filter.tags = { $in: tags.split(",").map((t) => t.trim().toLowerCase()) };
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
        .select(
          "title category subcategory difficulty tags companies successRate solvedCount timeLimit hints"
        )
        .lean(),
      Question.countDocuments(filter),
    ]);

    return success({
      questions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return serverError("Failed to get questions", error);
  }
}

export const GET = withAuth(handler);
