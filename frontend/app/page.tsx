import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryGrid from "@/components/home/CategoryGrid";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <CategoryGrid />
      <NewArrivals />
    </main>
  );
}
