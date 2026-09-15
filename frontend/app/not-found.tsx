import Link from "next/link";
import Container from "@/components/common/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center bg-[#F7F3EE]">
      <Container className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C4956A]">Error 404</p>
        <h1 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-8xl font-bold text-[#1C0A04]">
          404
        </h1>
        <p className="mt-4 text-xl text-[#5C2E1A]">Page not found</p>
        <p className="mt-2 text-sm text-[#A0673A] max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-[#5C2E1A] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
        >
          Back to Home
        </Link>
      </Container>
    </main>
  );
}
