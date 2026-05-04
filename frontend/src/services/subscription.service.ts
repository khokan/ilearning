import "server-only";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const subscriptionService = {
  create: async function (payload: { planId: string }) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Subscription failed" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  initiatePayment: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subscriptions/${id}/initiate-payment`, {
        method: "POST",
        headers: { Cookie: cookieStore.toString() },
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Payment initiation failed" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  list: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subscriptions`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Failed to load subscriptions" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

   listUsers: async function () {
      try {
        const cookieStore = await cookies();
        const res = await fetch(`${API_URL}/users`, {
          headers: { Cookie: cookieStore.toString() },
          cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) {
          return { data: null, error: { message: data?.message ?? "Failed to load users" } };
        }

        return { data, error: null };
      } catch {
        return { data: null, error: { message: "Something Went Wrong" } };
      }
    },
    
  getActive: async function () {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subscriptions/active`, {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: {
            message: data?.message ?? "Failed to load active subscription",
          },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  cancel: async function (id: string) {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/subscriptions/${id}/cancel`, {
        method: "PATCH",
        headers: { Cookie: cookieStore.toString() },
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message ?? "Cancel failed" },
        };
      }

      return { data, error: null };
    } catch {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};