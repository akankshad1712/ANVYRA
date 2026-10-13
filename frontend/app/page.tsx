import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryGrid from "@/components/home/CategoryGrid";
import CollectionsShowcase from "@/components/home/CollectionsShowcase";

export const metadata: Metadata = {
  title: "ANVYRA FASHION — Founded by Akanksha Deshmukh | Dress The Story",
  description:
    "ANVYRA FASHION is a premium Indian fashion brand founded by Akanksha Deshmukh in Pune, 2025. Shop premium jackets, oversized tees, shirts, trousers and jeans.",
  alternates: { canonical: "https://anvyra-ten.vercel.app" },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CollectionsShowcase />
      <FeaturedProducts />
      <CategoryGrid />
      <NewArrivals />
    </main>
  );
}
