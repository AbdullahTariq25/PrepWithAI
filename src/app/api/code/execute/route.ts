import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const JUDGE0_URL = (process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com").replace(/\/$/, "");
const JUDGE0_KEY = process.env.JUDGE0_API_KEY || "";
const JUDGE0_HOST = process.env.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";

const MAX_CODE_LENGTH = 100_000;
const MAX_STDIN_LENGTH = 20_000;
const MAX_TEST_CASES = 5;
const MAX_TEST_VALUE_LENGTH = 10_000;

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

interface TestCaseInput {
  input?: string;
  expectedOutput?: string;
}

interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string;
  memory: number;
}

function judge0Configured(): boolean {
  return !JUDGE0_URL.includes("rapidapi.com") || Boolean(JUDGE0_KEY);
}

function judge0Headers(includeJson = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (includeJson) headers["Content-Type"] = "application/json";
  if (JUDGE0_KEY) {
    headers["X-RapidAPI-Key"] = JUDGE0_KEY;
    headers["X-RapidAPI-Host"] = JUDGE0_HOST;
  }
  return headers;
}

async function createSubmission(code: string, languageId: number, stdin: string): Promise<string> {
  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
    method: "POST",
    headers: judge0Headers(true),
    signal: AbortSignal.timeout(12_000),
    body: JSON.stringify({
      source_code: Buffer.from(code).toString("base64"),
      language_id: languageId,
      stdin: Buffer.from(stdin).toString("base64"),
      cpu_time_limit: 5,
      wall_time_limit: 8,
      memory_limit: 128_000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 submission failed with status ${response.status}`);
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) throw new Error("Judge0 did not return a submission token");
  return data.token;
}

async function getSubmission(token: string): Promise<SubmissionResult> {
  const maxAttempts = 16;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetch(`${JUDGE0_URL}/submissions/${encodeURIComponent(token)}?base64_encoded=true`, {
      headers: judge0Headers(),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Judge0 status request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      stdout?: string | null;
      stderr?: string | null;
      compile_output?: string | null;
      status?: { id: number; description: string };
      time?: string;
      memory?: number;
    };

    if (!data.status) throw new Error("Judge0 returned an invalid status payload");

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
  }

  throw new Error("Code execution timed out");
}

function validateTestCases(value: unknown): TestCaseInput[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > MAX_TEST_CASES) return null;

  const normalized: TestCaseInput[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const testCase = item as TestCaseInput;
    const input = typeof testCase.input === "string" ? testCase.input : "";
    const expectedOutput = typeof testCase.expectedOutput === "string" ? testCase.expectedOutput : "";
    if (input.length > MAX_TEST_VALUE_LENGTH || expectedOutput.length > MAX_TEST_VALUE_LENGTH) return null;
    normalized.push({ input, expectedOutput });
  }
  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const code = typeof body.code === "string" ? body.code : "";
    const language = typeof body.language === "string" ? body.language : "";
    const stdin = typeof body.stdin === "string" ? body.stdin : "";
    const testCases = validateTestCases(body.testCases);

    if (!code.trim() || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    if (code.length > MAX_CODE_LENGTH || stdin.length > MAX_STDIN_LENGTH) {
      return NextResponse.json(
        { error: "The submitted code or input is too large for the execution sandbox" },
        { status: 413 },
      );
    }

    if (testCases === null) {
      return NextResponse.json(
        { error: `Provide at most ${MAX_TEST_CASES} valid test cases` },
        { status: 400 },
      );
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    if (!judge0Configured()) {
      return NextResponse.json(
        {
          error: "Code execution is temporarily unavailable because the execution provider is not configured.",
          code: "EXECUTION_PROVIDER_NOT_CONFIGURED",
        },
        { status: 503 },
      );
    }

    if (testCases.length > 0) {
      const results: Array<{
        input: string;
        expectedOutput: string;
        actualOutput: string;
        passed: boolean;
        executionTime: number;
      }> = [];
      let passedCount = 0;

      for (const testCase of testCases) {
        try {
          const token = await createSubmission(code, languageId, testCase.input || "");
          const result = await getSubmission(token);
          const actualOutput = (result.stdout || "").trim();
          const expectedOutput = (testCase.expectedOutput || "").trim();
          const passed = result.status.id === 3 && actualOutput === expectedOutput;
          if (passed) passedCount += 1;

          results.push({
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            actualOutput: actualOutput || result.stderr || result.compile_output || result.status.description,
            passed,
            executionTime: Number.parseFloat(result.time || "0") * 1000,
          });
        } catch (error) {
          console.error("Judge0 test case failed:", error);
          results.push({
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            actualOutput: "Execution failed for this test case",
            passed: false,
            executionTime: 0,
          });
        }
      }

      return NextResponse.json({
        stdout: results.map((result) => result.actualOutput).join("\n"),
        stderr: "",
        exitCode: passedCount === testCases.length ? 0 : 1,
        executionTime: results.reduce((sum, result) => sum + result.executionTime, 0),
        memoryUsed: 0,
        testResults: results,
        passedTests: passedCount,
        totalTests: testCases.length,
      });
    }

    const token = await createSubmission(code, languageId, stdin);
    const result = await getSubmission(token);

    return NextResponse.json({
      stdout: result.stdout || "",
      stderr: result.stderr || result.compile_output || "",
      exitCode: result.status.id === 3 ? 0 : 1,
      status: result.status.description,
      executionTime: Number.parseFloat(result.time || "0") * 1000,
      memoryUsed: result.memory,
      testResults: [],
      passedTests: 0,
      totalTests: 0,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      { error: "Code execution failed. Please try again." },
      { status: 502 },
    );
  }
}
