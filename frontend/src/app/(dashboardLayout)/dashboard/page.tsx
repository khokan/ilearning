
import DashboardSubscriptionPanel from "@/components/modules/student/dashboard-subscription-panel";
import { planService } from "@/services/plan.service";
import { subscriptionService } from "@/services/subscription.service";
import type { Plan } from "@/types/plan";
import type { Subscription } from "@/types/subscription";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPageWrapper() {
    const [plansResponse, subscriptionsResponse] = await Promise.all([
        planService.getPlans(),
        subscriptionService.list(),
    ]);

    const plans = (Array.isArray(plansResponse) ? plansResponse : []) as Plan[];
    const subscriptions =
        ((subscriptionsResponse.data as { data?: { items?: Subscription[] } } | null)?.data?.items ?? []) as Subscription[];

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-semibold md:text-3xl">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Your subscription overview and premium access are managed here.
                </p>
            </div>

            <DashboardSubscriptionPanel plans={plans} subscriptions={subscriptions} />
        </div>
    );
}