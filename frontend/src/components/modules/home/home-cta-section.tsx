import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { userService } from "@/services/user.service";
// import { getUserInfo } from "@/services/auth.services";

export default async function HomeCtaSection() {
  const userInfo = await userService.getSession()
  if (!userInfo?.data) {
    return null
  }

  return (
    <section className="border-t bg-muted/20 py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Limited Time Offer</span>
          </div>
          
          <h2 className="text-3xl font-bold sm:text-5xl">
            Ready to Transform Your Learning?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of students and tutors who are already experiencing
            the power of AI-driven learning. Start your journey today with
            iLearning.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {!userInfo?.data ? (
              <>
                <Button asChild size="lg" className="bg-success hover:bg-success/90">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard/subscription">
                    View Plans
                  </Link>
                </Button>
              </>
            )}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            ✓ No credit card required · ✓ Free forever tier available · ✓ Premium features included
          </p>
        </div>
      </div>
    </section>
  );
}
