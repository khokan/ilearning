"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProfile, updateProfile } from "@/actions/student.action";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: string;
};

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    image: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProfile();
      if (error) throw error;

      const me = data?.data ?? data; // supports {success,data} or direct
      setProfile(me);

      setForm({
        name: me?.name ?? "",
        phone: me?.phone ?? "",
        image: me?.image ?? "",
      });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setLoading(true);

      const payload = {
        name: form.name || undefined,
        phone: form.phone ? form.phone : null,
        image: form.image ? form.image : null,
      };

      const { error } = await updateProfile(payload);
      if (error) throw error;

      toast.success("Profile updated");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-muted-foreground">Update your student information.</p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="text-sm">
            <div className="font-medium">{profile?.email ?? ""}</div>
            <div className="text-muted-foreground">Role: {profile?.role ?? ""}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={loading}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              disabled={loading}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              disabled={loading}
              placeholder="Optional"
            />
          </div>

          <Button onClick={save} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
