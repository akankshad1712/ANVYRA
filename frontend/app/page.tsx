import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryGrid from "@/components/home/CategoryGrid";
import CollectionsShowcase from "@/components/home/CollectionsShowcase";

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
