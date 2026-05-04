import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomeNewsletterSection() {
  return (
    <section className="border-t bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-card p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-primary">Stay in the loop</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Get study tips and quiz updates</h2>
              <p className="mt-4 text-muted-foreground">
                Subscribe for weekly learning insights, premium quiz alerts, and study resources tailored for students.
              </p>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-border/70 bg-muted/40 p-6">
              <div className="flex items-center gap-3 text-primary">
                <Mail className="h-5 w-5" />
                <p className="font-semibold">Join 34,000+ learners</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input type="email" placeholder="Enter your email" />
                <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No spam. We send only useful updates, offers, and study resources you can use immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
