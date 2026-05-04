import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Sparkles, Users } from "lucide-react";

const values = [
  {
    title: "Subscription-first learning",
    description:
      "Our model is built around premium access: subscribe once, then unlock AI-powered quiz generation and learning tools.",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Secure Stripe payments",
    description:
      "Payments are processed securely through Stripe so users can buy a plan with confidence and focus on learning.",
    icon: <Award className="h-6 w-6" />,
  },
  {
    title: "Student-centered experience",
    description:
      "From quiz history to progress tracking, every feature is designed to help learners stay motivated and move faster.",
    icon: <Users className="h-6 w-6" />,
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/80 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">About iLearning</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">A smarter way to study with AI and subscriptions</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              iLearning combines subscription-based premium access with intelligent quiz generation to help students learn faster and retain more.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {value.icon}
                  </div>
                  <CardTitle className="mt-4 text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-[2rem] border border-border bg-card p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-primary">Our mission</p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Make premium learning tools available to every student.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  We believe the best learning experiences combine structure, personalization, and reliable access. iLearning was created to deliver all three in one subscription-powered platform.
                </p>
              </div>
              <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/40 p-6">
                <p className="text-sm font-semibold">Want to learn more?</p>
                <p className="text-sm text-muted-foreground">
                  Explore our subscription plans and start using AI-powered quizzes for smarter revision.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard/subscription">View plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
