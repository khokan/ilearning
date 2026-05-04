import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/80 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Support</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Need help? We’re here to support you.</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Reach out about subscriptions, AI quiz access, or any issue you encounter while learning.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card className="rounded-3xl border shadow-sm px-6 py-8 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-primary" />
              <CardHeader>
                <CardTitle className="mt-4">Help center</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find answers to common questions about subscriptions, billing, and AI quizzes.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border shadow-sm px-6 py-8 text-center">
              <Mail className="mx-auto h-10 w-10 text-primary" />
              <CardHeader>
                <CardTitle className="mt-4">Email support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">support@ilearning.com</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border shadow-sm px-6 py-8 text-center">
              <Phone className="mx-auto h-10 w-10 text-primary" />
              <CardHeader>
                <CardTitle className="mt-4">Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 rounded-[2rem] border border-border bg-card p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-bold">Still have questions?</h2>
                <p className="mt-4 text-muted-foreground">
                  Our support team is ready to help you get the most out of your subscription and AI quiz experience.
                </p>
              </div>
              <div className="text-center">
                <Button asChild>
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
