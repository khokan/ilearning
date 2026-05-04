import type { AdminSubscription } from "@/components/modules/admin/AdminSubscriptionsTable";

import { subscriptionService } from "@/services/subscription.service";
import AdminSubscriptionsTable from "@/components/modules/admin/AdminSubscriptionsTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionPage() {
  const { data } = await subscriptionService.list();

  const subscriptions: AdminSubscription[] = (() => {
    if (!data) return [] as AdminSubscription[];
    if (Array.isArray(data)) return data as AdminSubscription[];
    if (Array.isArray((data as { data?: { items?: AdminSubscription[] } }).data?.items)) {
      return (data as { data?: { items?: AdminSubscription[] } }).data!.items!;
    }
    if (Array.isArray((data as { data?: AdminSubscription[] }).data)) {
      return (data as { data?: AdminSubscription[] }).data as AdminSubscription[];
    }
    return [] as AdminSubscription[];
  })();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Subscription Management</h1>
        <p className="text-sm text-muted-foreground">
          Review all subscriptions and cancel active or pending entries when needed.
        </p>
      </div>

      <AdminSubscriptionsTable subscriptions={subscriptions} />
    </div>
  );
}
