"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";


export default function RegisterPage() {
  const [role, setRole] = useState<"STUDENT" | "ADMIN">("STUDENT");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        role,
      };

      const {data, error} = await  authClient.signUp.email(payload);

      if(error) {
      toast.error(`Registration failed: ${error.message}`);
      return;
     }

      toast.success("Account created!");
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-14">
      <Card className="w-full max-w-md rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose your role during signup.</p>

          <div className="mt-5 grid grid-cols-1 gap-2">
            {/* <Button variant={role === "STUDENT" ? "default" : "outline"} onClick={() => setRole("STUDENT")}>
              Student
            </Button> */}
            {/* <Button variant={role === "ADMIN" ? "default" : "outline"} onClick={() => setRole("tutor")}>
              Admin
            </Button> */}
          </div>

          <form action={onSubmit} className="mt-6 space-y-3">
            <Input name="name" placeholder="Full name" required />
            <Input name="email" placeholder="Email" type="email" required />
            <Input name="password" placeholder="Password" type="password" required />
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
