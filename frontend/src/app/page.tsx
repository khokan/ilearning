import HomePricingSection from "@/components/modules/home/home-pricing-section";
import HomeFeaturesSection from "@/components/modules/home/home-features-section";
import HomeTestimonialsSection from "@/components/modules/home/home-testimonials-section";
import HomeCtaSection from "@/components/modules/home/home-cta-section";
import { Footer } from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="border-b bg-muted/20 py-24 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn Smarter with iLearning
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              AI-powered personalized learning paths, structured guidance, and
              expert tutors. Transform your education journey with cutting-edge
              technology.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button asChild size="lg">
                <Link href="#pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <HomeFeaturesSection />

        {/* Testimonials Section */}
        <HomeTestimonialsSection />

        {/* Pricing Section */}
        <div id="pricing">
          <HomePricingSection />
        </div>

        {/* CTA Section */}
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}