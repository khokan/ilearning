import { Plan } from "@/types/plan";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const planService = {
  async getPlans(): Promise<Plan[]> {
    const res = await fetch(`${API_URL}/plans`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      credentials: "include",
    });

    const responseBody = await res.json();
    if (!res.ok) {
      throw new Error(responseBody?.message ?? "Failed to load plans");
    }

    return (responseBody?.data ?? responseBody) as Plan[];
  },
};
