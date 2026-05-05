"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createSubscription,
  getSubscriptions,
  initiateSubscriptionPayment,
} from "@/actions/subscription.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { Plan } from "@/types/plan";
import type { Subscription } from "@/types/subscription";
import { hasValidPremiumAccess, hasAnyPremiumAccess } from "@/utils/subscriptionAccess";

type Props = {
  plans: Plan[];
  subscriptions: Subscription[];
};

const rankSubscription = (item: Subscription) => {
  if (hasValidPremiumAccess(item)) return 3;
  if (item.status === "PENDING") return 2;
  if (item.status === "PAST_DUE") return 1;
  return 0;
};

export default function DashboardSubscriptionPanel({ plans, subscriptions }: Props) {
  const router = useRouter();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [localSubscriptions, setLocalSubscriptions] = useState<Subscription[]>(subscriptions);

  const bestSubscription = useMemo(() => {
    if (!localSubscriptions.length) return null;

    return [...localSubscriptions].sort((a, b) => rankSubscription(b) - rankSubscription(a))[0] ?? null;
  }, [localSubscriptions]);

  const subscriptionByPlanId = useMemo(() => {
    const map = new Map<string, Subscription>();

    for (const sub of localSubscriptions) {
      const planId = sub.planId ?? sub.plan?.id;
      if (!planId) continue;

      const existing = map.get(planId);
      if (!existing || rankSubscription(sub) > rankSubscription(existing)) {
        map.set(planId, sub);
      }
    }

    return map;
  }, [localSubscriptions]);

  const hasPremiumAccess = hasAnyPremiumAccess(localSubscriptions);

  const reloadSubscriptions = async () => {
    const { data, error } = await getSubscriptions();
    if (error) {
      throw new Error(error.message || "Failed to reload subscriptions");
    }

    const items =
      ((data as { data?: { items?: Subscription[] } } | null)?.data?.items ?? []) as Subscription[];
    setLocalSubscriptions(items);
  };

  const hasSubscription = Boolean(bestSubscription);

  const handleSubscribe = async (planId: string) => {
    try {
      setActiveActionId(planId);

      const { error } = await createSubscription({ planId });
      if (error) {
        throw new Error(error.message || "Subscription creation failed");
      }

      await reloadSubscriptions();

      toast.success("Subscription created", {
        description: "Plan status updated. Complete payment if required.",
      });
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("log in") || message.toLowerCase().includes("unauthorized")) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      toast.error("Subscription failed", {
        description: message,
      });
    } finally {
      setActiveActionId(null);
    }
  };

  const handlePayNow = async (subscriptionId: string) => {
    try {
      setActiveActionId(subscriptionId);

      const { data, error } = await initiateSubscriptionPayment(subscriptionId);
      if (error) {
        throw new Error(error.message || "Payment initiation failed");
      }

      const paymentUrl =
        (data as { data?: { paymentUrl?: string } } | null)?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Payment URL not found");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("log in") || message.toLowerCase().includes("unauthorized")) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      toast.error("Payment failed", {
        description: message,
      });
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>
            Check your subscription and continue with premium learning features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasSubscription ? (
            <>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Current subscription</p>
                <p className="mt-1 text-lg font-semibold">
                  {bestSubscription?.plan?.name || "Subscribed Plan"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Status: {bestSubscription?.status} | Payment: {bestSubscription?.paymentStatus}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {hasPremiumAccess ? (
                  <Button asChild>
                    <Link href="/dashboard/premium-feature">Go To Premium Features</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/dashboard/subscription">Manage Subscription</Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You are not subscribed yet. Choose a plan below to continue.
            </p>
          )}
        </CardContent>
      </Card>

      {!hasPremiumAccess ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const sub = subscriptionByPlanId.get(plan.id);
            const isPendingUnpaid =
              sub?.status === "PENDING" && sub?.paymentStatus === "UNPAID";
            const isActiveOrTrial = sub ? hasValidPremiumAccess(sub) : false;
            const isExpired = sub?.status === "EXPIRED";
            const isCancelled = sub?.status === "CANCELLED";

            return (
              <Card key={plan.id} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span>{plan.name}</span>
                    <span className="text-xs text-muted-foreground">{plan.interval}</span>
                  </CardTitle>
                  <CardDescription>{plan.description || "No description available."}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-semibold">
                    {plan.currency}
                    {plan.price}
                  </p>

                  {sub ? (
                    <p className="text-sm text-muted-foreground">
                      Status: {sub.status} | Payment: {sub.paymentStatus}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Status: Not subscribed
                    </p>
                  )}

                  {isPendingUnpaid ? (
                    <Button
                      className="w-full"
                      disabled={activeActionId === sub.id}
                      onClick={() => handlePayNow(sub.id)}
                    >
                      {activeActionId === sub.id ? "Processing..." : "Pay Now"}
                    </Button>
                  ) : isActiveOrTrial ? (
                    <Button className="w-full" variant="outline" disabled>
                      Subscribed
                    </Button>
                  ) : isCancelled || isExpired ? (
                    <Button
                      className="w-full"
                      disabled={activeActionId === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {activeActionId === plan.id ? "Subscribing..." : "Subscribe Again"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={activeActionId === plan.id}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {activeActionId === plan.id ? "Subscribing..." : "Subscribe"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
