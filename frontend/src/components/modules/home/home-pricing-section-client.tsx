"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { planService } from "@/services/plan.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { mapSubscriptionErrorToToast } from "@/lib/subscriptionErrors";
import { logger } from "@/utils/logger";
import {
  createSubscription,
  getActiveSubscription,
} from "@/actions/subscription.actions";

const billingLabels: Record<string, string> = {
  DAILY: "Daily",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
  LIFETIME: "Lifetime",
};

interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
}

interface HomePricingSectionClientProps {
  isAuthenticated: boolean;
}

export default function HomePricingSectionClient({
  isAuthenticated,
}: HomePricingSectionClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: plans = [],
    isLoading: plansLoading,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: () => planService.getPlans(),
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: activeSubscription,
    isLoading: activeSubscriptionLoading,
  } = useQuery({
    queryKey: ["activeSubscription"],
    queryFn: async () => {
      const { data, error } = await getActiveSubscription();
      if (error) {
        throw new Error(error.message || "Failed to load subscription status");
      }
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/dashboard/subscription&plan=${planId}`);
      return;
    }

    let loadingToastId: string | number | undefined;

    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading("Creating subscription...");

      const result = await createSubscription({ planId });
      if (result.error) {
        throw new Error(result.error.message || "Subscription creation failed");
      }

      const subscriptionId = (result.data as { data?: { id?: string } } | null)?.data?.id;
      if (!subscriptionId) {
        throw new Error("Subscription creation failed: No subscription ID returned");
      }

      toast.dismiss(loadingToastId);
      toast.success("Subscription created", {
        description: "Complete payment through Stripe to start AI quiz access.",
      });
      router.push("/dashboard/subscription");
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.dismiss(loadingToastId);
      }

      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("unauthorized")) {
        router.push(`/login?redirect=/dashboard/subscription&plan=${planId}`);
        return;
      }

      const toastMessage = mapSubscriptionErrorToToast(message);
      void logger.error("Subscription creation failed", {
        message,
        planId,
        errorObject: error,
      });

      toast.error(toastMessage.title, {
        description: toastMessage.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-muted/10 dark:bg-slate-950 text-foreground py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">Subscription plans</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Premium access for AI quiz generation
          </h2>
          <p className="mt-4 text-muted-foreground">
            Select a Stripe-backed subscription and unlock plan-based AI quizzes, practice modes, and progress tracking.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-xl shadow-slate-950/10 dark:bg-slate-950/90 dark:shadow-slate-950/30">
            <h3 className="text-xl font-semibold">Your subscription status</h3>
            <p className="mt-3 text-sm text-slate-400">
              This section shows your current active plan and payment status from the backend.
            </p>

            <div className="mt-6 space-y-4">
              {activeSubscriptionLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 rounded-3xl" />
                  <Skeleton className="h-12 rounded-3xl" />
                </div>
              ) : activeSubscription ? (
                <div className="rounded-[1.75rem] border border-primary/20 bg-slate-50/90 p-6 text-slate-950 shadow-sm dark:bg-slate-950/90 dark:text-slate-50">
                  <p className="text-sm uppercase tracking-[0.28em] text-primary">Active plan</p>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">{activeSubscription.plan?.name ?? "Subscribed plan"}</p>
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                        {activeSubscription.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {activeSubscription.paymentStatus === "PAID" ? "Stripe payment completed." : "Pending payment via Stripe."}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-100 p-4 text-slate-950 shadow-sm dark:bg-slate-900 dark:text-slate-50">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Start</p>
                        <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">{activeSubscription.startDate ? new Date(activeSubscription.startDate).toLocaleDateString() : "-"}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100 p-4 text-slate-950 shadow-sm dark:bg-slate-900 dark:text-slate-50">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Expires</p>
                        <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">{activeSubscription.endDate ? new Date(activeSubscription.endDate).toLocaleDateString() : "No end date"}</p>
                      </div>
                    </div>
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/dashboard/subscription">Manage subscription</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-border/70 bg-slate-50/90 p-6 text-slate-950 shadow-sm dark:bg-slate-950/90 dark:text-slate-50">
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">No active subscription</p>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Register or sign in to choose a subscription and start using the AI quiz generator.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:w-auto">
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {plansLoading ? (
              <div className="grid gap-5 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="rounded-[1.75rem] bg-slate-100 p-6 shadow-sm dark:bg-slate-900">
                    <Skeleton className="h-6 w-3/4 rounded-full" />
                    <Skeleton className="mt-4 h-5 rounded-full" />
                    <Skeleton className="mt-6 h-40 rounded-[1.5rem]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {plans.map((plan: Plan) => (
                  <Card key={plan.id} className="h-full rounded-3xl border border-border/70 bg-white/90 shadow-sm text-slate-950 dark:bg-slate-950/90 dark:text-slate-50">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-primary">{billingLabels[plan.interval] ?? plan.interval}</p>
                          <CardTitle className="mt-3 text-xl text-slate-950 dark:text-slate-50">{plan.name}</CardTitle>
                        </div>
                        <span className="text-right text-slate-500 dark:text-slate-400">
                          <span className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{plan.currency}{plan.price}</span>
                          <span className="block text-sm text-slate-500 dark:text-slate-400">/ {plan.interval.toLowerCase()}</span>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between gap-6 px-6 pb-6 pt-0">
                      <div className="space-y-3">
                        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description ?? "Includes Stripe payment and AI quiz access."}</p>
                        <div className="grid gap-2">
                          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                            Plan access
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Priority AI generated quiz sessions and dashboard access.</span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {isAuthenticated ? "Subscribe now" : "Login to subscribe"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}