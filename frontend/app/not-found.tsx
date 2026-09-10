import Link from "next/link";
import Container from "@/components/common/Container";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center">
      <Container className="text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-8xl font-bold text-zinc-950">
          404
        </h1>
        <p className="mt-4 text-xl text-zinc-600">Page not found</p>
        <p className="mt-2 text-sm text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-black px-8 py-3 font-semibold text-white hover:bg-zinc-800"
        >
          Back to Home
        </Link>
      </Container>
    </main>
  );
}
