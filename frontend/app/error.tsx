"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/common/Container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-6xl font-bold text-zinc-950">
          500
        </h1>
        <p className="mt-4 text-xl text-zinc-600">Something went wrong</p>
        <p className="mt-2 text-sm text-zinc-500 max-w-sm mx-auto">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-zinc-800"
          >
            Try Again
          </button>
          <Link href="/" className="rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 hover:border-zinc-500">
            Go Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
