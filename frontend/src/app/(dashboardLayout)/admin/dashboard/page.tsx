import Link from "next/link";
import { DashboardSkeleton } from "@/components/modules/admin/DashboardSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/services/subscription.service";
import { Suspense } from "react";
import type { Subscription } from "@/types/subscription";


export const dynamic = "force-dynamic";

function parseItems<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray((data as { data?: T[] }).data)) return (data as { data?: T[] }).data as T[];
  if (Array.isArray((data as { data?: { items?: T[] } }).data?.items)) {
    return (data as { data?: { items?: T[] } }).data!.items!;
  }
  return [];
}

export default async function AdminDashboard() {
  const [usersResult, subscriptionsResult] = await Promise.all([
    subscriptionService.listUsers(),
    subscriptionService.list(),
  ]);

  const users = parseItems(usersResult.data);
  const subscriptions = parseItems<Subscription>(subscriptionsResult.data);

  const totalUsers = users.length;
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter((item) => item.status === "ACTIVE").length;
  const pendingSubscriptions = subscriptions.filter((item) => item.status === "PENDING").length;
  const cancelledSubscriptions = subscriptions.filter((item) => item.status === "CANCELLED").length;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Monitor users and subscriptions at a glance. Use the quick links below to manage accounts and subscription activity.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Registered users in the platform.</CardDescription>
            </CardHeader>
            <CardContent className="text-4xl font-semibold">{totalUsers}</CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Total Subscriptions</CardTitle>
              <CardDescription>All subscription records across users.</CardDescription>
            </CardHeader>
            <CardContent className="text-4xl font-semibold">{totalSubscriptions}</CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>Currently active plans.</CardDescription>
            </CardHeader>
            <CardContent className="text-4xl font-semibold">{activeSubscriptions}</CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Pending Subscriptions</CardTitle>
              <CardDescription>Subscriptions waiting for payment or approval.</CardDescription>
            </CardHeader>
            <CardContent className="text-4xl font-semibold">{pendingSubscriptions}</CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl col-span-2">
            <CardHeader>
              <CardTitle>Recent Subscription Status</CardTitle>
              <CardDescription>Quick view of cancellation and open subscriptions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="mt-2 text-3xl font-semibold">{cancelledSubscriptions}</p>
              </div>
              <div className="rounded-3xl border border-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="mt-2 text-3xl font-semibold">{subscriptions.filter((item) => item.status === "EXPIRED").length}</p>
              </div>
              <div className="rounded-3xl border border-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Past Due</p>
                <p className="mt-2 text-3xl font-semibold">{subscriptions.filter((item) => item.status === "PAST_DUE").length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Go directly to admin tools.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/admin/dashboard/users">Manage Users</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard/subscriptions">Manage Subscriptions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}