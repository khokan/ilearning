import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border p-8 text-center">
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        <p className="mt-3 text-muted-foreground">
          Your payment was successful. Your subscription is now active.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/subscription">View Subscriptions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}