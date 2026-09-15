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
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center bg-[#F7F3EE]">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">Error 500</p>
        <h1 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-6xl font-bold text-[#1C0A04]">
          500
        </h1>
        <p className="mt-4 text-xl text-[#5C2E1A]">Something went wrong</p>
        <p className="mt-2 text-sm text-[#A0673A] max-w-sm mx-auto">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-[#5C2E1A] px-6 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[#C4956A] px-6 py-3 font-semibold text-[#5C2E1A] hover:border-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </Container>
    </main>
  );
}
