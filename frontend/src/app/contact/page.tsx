import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border/80 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-primary">Contact</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Need help? We&apos;re here for you.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Reach the iLearning support team for questions about subscriptions, courses, or account help.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">Email Support</h2>
              <p className="mt-3 text-sm text-muted-foreground">support@ilearning.com</p>
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link href="mailto:support@ilearning.com">Send Email</Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <Phone className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">Phone</h2>
              <p className="mt-3 text-sm text-muted-foreground">+1 (555) 123-4567</p>
              <Button asChild variant="outline" className="mt-6 w-full">
                <Link href="tel:+15551234567">Call us</Link>
              </Button>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-info/10 text-info">
                <MapPin className="h-5 w-5" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">Headquarters</h2>
              <p className="mt-3 text-sm text-muted-foreground">Dhaka, Bangladesh</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Available Monday to Friday, 9am–6pm local time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
