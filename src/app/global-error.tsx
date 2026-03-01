"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#080808] text-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
          <p className="text-[#A3A3A3] mb-6">
            We encountered an unexpected error. Our team has been notified and
            is working on a fix.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
