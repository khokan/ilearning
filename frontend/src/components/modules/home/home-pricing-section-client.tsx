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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { mapSubscriptionErrorToToast } from "@/lib/subscriptionErrors";
import { logger } from "@/utils/logger";
import type { Subscription } from "@/types/subscription";
import { createSubscription, getSubscriptions } from "@/actions/subscription.actions";

type BillingInterval = "DAILY" | "MONTHLY" | "YEARLY" | "LIFETIME";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  interval: BillingInterval;
}

interface HomePricingSectionClientProps {
  isAuthenticated: boolean;
}

export default function HomePricingSectionClient({
  isAuthenticated,
}: HomePricingSectionClientProps) {
  const router = useRouter();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => planService.getPlans(),
    staleTime: 1000 * 60 * 60,
  });

  const { data: mySubscriptions = [] } = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const { data, error } = await getSubscriptions();
      if (error) {
        throw new Error(error.message || "Failed to load subscriptions");
      }
      const items = (data as { data?: { items?: Subscription[] } } | null)?.data?.items;
      return items ?? [];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  const hasActiveSubscription = Array.isArray(mySubscriptions)
    ? mySubscriptions.some((s: Subscription) => s.status === "ACTIVE" || s.status === "TRIAL")
    : false;

  const activeSubscription = Array.isArray(mySubscriptions)
    ? (mySubscriptions.find((s: Subscription) => s.status === "ACTIVE" || s.status === "TRIAL") as Subscription | null)
    : null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/?plan=${planId}`);
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
        description: "You can complete payment from My Subscriptions.",
      });
      router.push("/dashboard/subscription");
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.dismiss(loadingToastId);
      }

      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("unauthorized")) {
        router.push(`/login?redirect=/?plan=${planId}`);
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

  // New: Always use DAILY plan id for the "Start Free Plan" CTA
  const handleStartFreePlan = async () => {
    const dailyPlan = plans.find((p: Plan) => p.interval === "DAILY");
    if (!dailyPlan) {
      toast.error("No daily plan available", {
        description: "Please try again later.",
      });
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/?plan=${dailyPlan.id}`);
      return;
    }

    let loadingToastId: string | number | undefined;

    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading("Creating subscription...");

      const result = await createSubscription({ planId: dailyPlan.id });
      if (result.error) {
        throw new Error(result.error.message || "Free plan activation failed");
      }

      const subscriptionId = (result.data as { data?: { id?: string } } | null)?.data?.id;
      if (!subscriptionId) {
        throw new Error("Free plan activation failed: No subscription ID returned");
      }

      toast.dismiss(loadingToastId);
      toast.success("Free plan started", {
        description: "Your daily plan was created. Complete payment from My Subscriptions if needed.",
      });
      router.push("/dashboard/subscription");
    } catch (error) {
      if (loadingToastId !== undefined) {
        toast.dismiss(loadingToastId);
      }

      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("unauthorized")) {
        router.push(`/login?redirect=/?plan=${dailyPlan.id}`);
        return;
      }

      const toastMessage = mapSubscriptionErrorToToast(message);

      void logger.error("Free plan activation failed", {
        message,
        planId: dailyPlan.id,
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Choose your subscription plan
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pick a plan and unlock your student dashboard.
          </p>

          {/* Global Start Free Plan CTA that always uses DAILY plan id */}
          <div className="mt-6 flex items-center justify-center flex-col">
            <div className="mb-3 text-sm text-muted-foreground">
              {hasActiveSubscription ? (
                <>
                  <span className="font-medium">Subscription:</span>{" "}
                  {activeSubscription?.status}
                  {activeSubscription?.endDate ? ` • Active until ${new Date(activeSubscription.endDate).toLocaleDateString()}` : ""}
                </>
              ) : (
                <span className="font-medium">No active subscription</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline" disabled={!hasActiveSubscription}>
                <Link href="/dashboard/premium-feature">
                  Premium features
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Loading plans...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan: Plan) => (
              <Card key={plan.id} className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {plan.interval}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <span className="text-4xl font-bold">{plan.currency ? `${plan.currency}${plan.price}` : plan.price}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      /{plan.interval.toLowerCase()}
                    </span>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}