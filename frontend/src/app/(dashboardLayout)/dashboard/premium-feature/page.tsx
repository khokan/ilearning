
import { History, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizGeneratorClient } from "@/components/modules/iquiz/QuizGeneratorClient";
import { subscriptionService } from "@/services/subscription.service";
import type { Subscription } from "@/types/subscription";
import { hasAnyPremiumAccess } from "@/utils/subscriptionAccess";

export async function QuizGeneratorPage() {
  const { data, error } = await subscriptionService.list();

  const subscriptions =
    ((data as { data?: { items?: Subscription[] } } | null)?.data?.items ?? []) as Subscription[];

  const hasAccess = hasAnyPremiumAccess(subscriptions);

  if (error || !hasAccess) {
    redirect("/dashboard/subscription?error=subscription_required");
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>AI Quiz Generator</CardTitle>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/quiz-history">
              <History className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
        </div>
        <CardDescription>
          Generate a timed, multiple-choice quiz to test your knowledge.
        </CardDescription>
      </CardHeader>

      <QuizGeneratorClient />
    </Card>
  );
}

export default QuizGeneratorPage;