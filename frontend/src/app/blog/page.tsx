import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  {
    title: "How subscriptions power premium AI learning",
    description: "Discover why our Stripe-backed plans are the best way to unlock AI quiz generation.",
    date: "April 20, 2026",
    slug: "subscriptions-ai-learning",
  },
  {
    title: "Study smarter: using quiz history to improve retention",
    description: "Learn how tracking your quiz progress can make every study session more effective.",
    date: "March 8, 2026",
    slug: "quiz-history-retention",
  },
  {
    title: "Choosing the right plan for your learning goals",
    description: "A simple guide to help students pick the best subscription tier for their schedule.",
    date: "February 14, 2026",
    slug: "choose-the-right-plan",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/80 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Blog</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Insights for smarter study habits</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Read the latest tips and product updates on subscriptions, AI learning, and student success.
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{post.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">{post.date}</p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/blog/${post.slug}`}>Read article</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
