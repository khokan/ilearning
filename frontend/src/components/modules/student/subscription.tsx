"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  getPlans,
  getSubscriptions,
  createSubscription,
  initiateSubscriptionPayment,
  cancelSubscription,
} from "@/actions/subscription.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Plan } from "@/types/plan";
import type { Subscription } from "@/types/subscription";
import { hasValidPremiumAccess } from "@/utils/subscriptionAccess";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export default function StudentSubscriptionPage() {
  const searchParams = useSearchParams();
  const hasShownRedirectToast = useRef(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);

      const [plansRes, subscriptionsRes] = await Promise.all([
        getPlans(),
        getSubscriptions(),
      ]);

      if (plansRes.error) throw plansRes.error;
       setPlans((plansRes.data ?? []) as Plan[]);

      if (subscriptionsRes.error) throw subscriptionsRes.error;
      setSubscriptions((subscriptionsRes.data?.data?.items ?? []) as Subscription[]);
      
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to load subscriptions"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error !== "subscription_required" || hasShownRedirectToast.current) {
      return;
    }

    hasShownRedirectToast.current = true;
    toast.error("Your subscription is not active. Please subscribe to access premium features.");
  }, [searchParams]);

  const subscriptionByPlanId = useMemo(() => {
    const map = new Map<string, Subscription>();

    for (const sub of subscriptions) {
      const planId = sub.planId ?? sub.plan?.id;
      if (!planId) continue;

      const existing = map.get(planId);

      if (!existing) {
        map.set(planId, sub);
        continue;
      }

      const rank = (item: Subscription) => {
        if (hasValidPremiumAccess(item)) return 3;
        if (item.status === "PENDING" && item.paymentStatus === "UNPAID") return 2;
        if (item.status === "CANCELLED" || item.status === "EXPIRED") return 1;
        return 0;
      };

      if (rank(sub) > rank(existing)) {
        map.set(planId, sub);
      }
    }

    return map;
  }, [subscriptions]);

  const subscribe = async (planId: string) => {
    try {
      setActionId(planId);

      const { data, error } = await createSubscription({ planId });
      if (error) throw error;

      const subscriptionId = data?.data?.id;
      if (!subscriptionId) throw new Error("Subscription created but id not found");

      toast.success("Subscription created");
      await load();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Subscription failed"));
    } finally {
      setActionId(null);
    }
  };

  const payNow = async (subscriptionId: string) => {
    try {
      setActionId(subscriptionId);

      const { data, error } = await initiateSubscriptionPayment(subscriptionId);
      if (error) throw error;

      const paymentUrl = data?.data?.paymentUrl;
      if (!paymentUrl) throw new Error("Payment URL not found");

      window.location.href = paymentUrl;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Payment initiation failed"));
    } finally {
      setActionId(null);
    }
  };

  const cancel = async (subscriptionId: string) => {
    try {
      setActionId(subscriptionId);

      const { error } = await cancelSubscription(subscriptionId);
      if (error) throw error;

      toast.success("Subscription cancelled");
      await load();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Cancel failed"));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Subscription Plans</h1>
        <p className="text-sm text-muted-foreground">
          Choose a plan, create subscription, and complete payment.
        </p>
      </div>

      {plans.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No plans found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const sub = subscriptionByPlanId.get(plan.id);

            const isPendingUnpaid =
              sub?.status === "PENDING" && sub?.paymentStatus === "UNPAID";
            const isActivePaid = sub ? hasValidPremiumAccess(sub) : false;
            const isCancelled = sub?.status === "CANCELLED";
            const isExpired = sub?.status === "EXPIRED";

            return (
              <Card key={plan.id} className="rounded-2xl">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-medium">{plan.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.slug}
                        </div>
                      </div>

                      <span className="rounded-full border px-2 py-1 text-xs">
                        {plan.interval}
                      </span>
                    </div>

                    <p className="min-h-10 text-sm text-muted-foreground">
                      {plan.description || "No description available."}
                    </p>

                    <div className="text-base font-semibold">
                      {plan.price} {plan.currency}
                    </div>

                    {sub ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full border px-2 py-1">
                          {sub.status}
                        </span>
                        <span className="rounded-full border px-2 py-1">
                          {sub.paymentStatus}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    {isPendingUnpaid ? (
                      <>
                        <Button
                          disabled={actionId === sub.id}
                          onClick={() => payNow(sub.id)}
                        >
                          Pay Now
                        </Button>

                        <Button
                          variant="destructive"
                          disabled={actionId === sub.id}
                          onClick={() => cancel(sub.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : isActivePaid ? (
                      <Button variant="outline" disabled>
                        Subscribed
                      </Button>
                    ) : isCancelled || isExpired ? (
                      <Button
                        disabled={actionId === plan.id}
                        onClick={() => subscribe(plan.id)}
                      >
                        Subscribe Again
                      </Button>
                    ) : (
                      <Button
                        disabled={actionId === plan.id || loading}
                        onClick={() => subscribe(plan.id)}
                      >
                        Subscribe
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
