"use server";

import { planService } from "@/services/plan.service";
import { subscriptionService } from "@/services/subscription.service";


export async function getPlans() {
  try {
    const data = await planService.getPlans();
    return { data, error: null };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Failed to load plans";

    return { data: null, error: { message } };
  }
}

export async function createSubscription(payload: { planId: string }) {
  return subscriptionService.create(payload);
}

export async function getSubscriptions() {
  return subscriptionService.list();
}

export async function getActiveSubscription() {
  return subscriptionService.getActive();
}

export async function cancelSubscription( planId: string ) {
  return subscriptionService.cancel(planId);
}

export async function initiateSubscriptionPayment(id: string) {
  return subscriptionService.initiatePayment(id);
}