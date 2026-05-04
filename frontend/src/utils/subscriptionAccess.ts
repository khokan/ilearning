import type { BillingInterval } from "@/types/plan";
import type { Subscription } from "@/types/subscription";

const ACCESS_STATUSES = new Set(["ACTIVE", "TRIAL"]);

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addInterval(startDate: Date, interval: BillingInterval): Date | null {
  const next = new Date(startDate.getTime());

  switch (interval) {
    case "DAILY":
      next.setUTCDate(next.getUTCDate() + 1);
      return next;
    case "MONTHLY":
      next.setUTCMonth(next.getUTCMonth() + 1);
      return next;
    case "YEARLY":
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      return next;
    case "LIFETIME":
      return null;
    default:
      return null;
  }
}

export function getEffectiveSubscriptionEndDate(subscription: Subscription): Date | null {
  const explicitEndDate = toDate(subscription.endDate);
  if (explicitEndDate) return explicitEndDate;

  const startDate = toDate(subscription.startDate);
  const interval = subscription.plan?.interval;

  if (!startDate || !interval) return null;
  return addInterval(startDate, interval);
}

export function hasValidPremiumAccess(
  subscription: Subscription,
  now: Date = new Date()
): boolean {
  if (!ACCESS_STATUSES.has(subscription.status)) return false;

  if (subscription.status === "ACTIVE" && subscription.paymentStatus !== "PAID") {
    return false;
  }

  const startDate = toDate(subscription.startDate);
  if (startDate && now < startDate) return false;

  const endDate = getEffectiveSubscriptionEndDate(subscription);
  if (endDate && now > endDate) return false;

  return true;
}

export function hasAnyPremiumAccess(
  subscriptions: Subscription[],
  now: Date = new Date()
): boolean {
  return subscriptions.some((subscription) => hasValidPremiumAccess(subscription, now));
}
