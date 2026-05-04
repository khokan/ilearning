import HomeCategoriesSection from "@/components/modules/home/home-categories-section";
import HomeFeaturesSection from "@/components/modules/home/home-features-section";
import HomeHeroSection from "@/components/modules/home/home-hero-section";
import HomeHighlightsSection from "@/components/modules/home/home-highlights-section";
import HomeNewsletterSection from "@/components/modules/home/home-newsletter-section";
import HomePricingSection from "@/components/modules/home/home-pricing-section";
import HomeTestimonialsSection from "@/components/modules/home/home-testimonials-section";
import HomeCtaSection from "@/components/modules/home/home-cta-section";
import { Footer } from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HomeHeroSection />
        <HomeCategoriesSection />
        <HomeHighlightsSection />
        <HomeFeaturesSection />
        <HomeTestimonialsSection />
        <div id="pricing">
          <HomePricingSection />
        </div>
        <HomeNewsletterSection />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}