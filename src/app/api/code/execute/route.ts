import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const JUDGE0_URL = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || "";

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string;
  memory: number;
}

async function createSubmission(
  code: string,
  languageId: number,
  stdin: string
): Promise<string> {
  const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": JUDGE0_KEY,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    body: JSON.stringify({
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageId,
      stdin: Buffer.from(stdin).toString("base64"),
      cpu_time_limit: 5,
      memory_limit: 128000,
    }),
  });

  if (!res.ok) {
    throw new Error(`Judge0 submission failed: ${res.status}`);
  }

  const data = await res.json();
  return data.token;
}

async function getSubmission(token: string): Promise<SubmissionResult> {
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const res = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Judge0 get submission failed: ${res.status}`);
    }

    const data = await res.json();

    // Status 1 = In Queue, 2 = Processing
    if (data.status.id > 2) {
      return {
        stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString() : null,
        stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString() : null,
        compile_output: data.compile_output
          ? Buffer.from(data.compile_output, "base64").toString()
          : null,
        status: data.status,
        time: data.time || "0",
        memory: data.memory || 0,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    attempts++;
  }

  throw new Error("Submission timed out");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, language, stdin, testCases } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    // If no Judge0 API key, use a mock execution for development
    if (!JUDGE0_KEY) {
      return NextResponse.json({
        stdout: "// Code execution requires Judge0 API key\n// Set JUDGE0_API_KEY in your .env.local\n// Get a free key at https://rapidapi.com/judge0-official/api/judge0-ce",
        stderr: "",
        exitCode: 0,
        executionTime: 0,
        memoryUsed: 0,
        testResults: testCases
          ? testCases.map((tc: { input: string; expectedOutput: string }) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              actualOutput: "Mock output",
              passed: false,
              executionTime: 0,
            }))
          : [],
        passedTests: 0,
        totalTests: testCases ? testCases.length : 0,
      });
    }

    // If test cases provided, run each one
    if (testCases && testCases.length > 0) {
      const results = [];
      let passedCount = 0;

      for (const testCase of testCases) {
        try {
          const token = await createSubmission(code, languageId, testCase.input || "");
          const result = await getSubmission(token);
          const actualOutput = (result.stdout || "").trim();
          const expectedOutput = (testCase.expectedOutput || "").trim();
          const passed = actualOutput === expectedOutput;

          if (passed) passedCount++;

          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: actualOutput || result.stderr || result.compile_output || "",
            passed,
            executionTime: parseFloat(result.time) * 1000,
          });
        } catch {
          results.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: "Execution error",
            passed: false,
            executionTime: 0,
          });
        }
      }

      return NextResponse.json({
        stdout: results.map((r) => r.actualOutput).join("\n"),
        stderr: "",
        exitCode: passedCount === testCases.length ? 0 : 1,
        executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
        memoryUsed: 0,
        testResults: results,
        passedTests: passedCount,
        totalTests: testCases.length,
      });
    }

    // Single execution
    const token = await createSubmission(code, languageId, stdin || "");
    const result = await getSubmission(token);

    return NextResponse.json({
      stdout: result.stdout || "",
      stderr: result.stderr || result.compile_output || "",
      exitCode: result.status.id === 3 ? 0 : 1,
      executionTime: parseFloat(result.time) * 1000,
      memoryUsed: result.memory,
      testResults: [],
      passedTests: 0,
      totalTests: 0,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      { error: "Code execution failed. Please try again." },
      { status: 500 }
    );
  }
}
