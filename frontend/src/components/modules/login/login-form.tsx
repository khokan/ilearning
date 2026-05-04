
"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";



export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";

  

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

    const { error } = await authClient.signIn.email({ email, password });

     if(error) {
        toast.error(`Login failed: ${error.message}`);
        return;
     }
      toast.success("Welcome back!");
      router.push(next);
      router.refresh();

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-14">
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your dashboard and subscriptions.</p>

          <form action={onSubmit} className="mt-6 space-y-3">
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="password" placeholder="Password" type="password" required />
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 justify-end">
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Create account</Link>
          </Button>
        {/* <Button
          onClick={async () => {
            setGoogleLoading(true);
            try {
              await signInWithGoogle(next);
            } catch {
              toast.error("Google sign in failed. Please try again.");
              setGoogleLoading(false);
            }
          }}
          variant="outline"
          type="button"
          disabled={googleLoading}
          className="w-full"
        >
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </Button> */}
      </CardFooter>
      </Card>
    </div>
  );
}



export const signInWithGoogle = async (next: string = "/dashboard") => {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  return await authClient.signIn.social({
    provider: "google",
    callbackURL: `${origin}${next.startsWith("/") ? next : "/dashboard"}`,
  });
};
