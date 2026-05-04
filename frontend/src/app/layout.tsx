import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import type { Metadata } from "next";

// app/layout.tsx
export const dynamic = "force-dynamic";

import { Toaster } from "sonner";
import QueryProviders from "@/providers/Queryprovider";

export const metadata: Metadata = {
  title: "iLearn — Student Dashboard for Learning & Subscriptions",
  description: "Manage your learning, subscriptions, and profile from a modern student dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <ThemeProvider>
            <QueryProviders>
                  {children}
                  <Toaster position="top-right" richColors />
             </QueryProviders>
          </ThemeProvider>
      </body>
    </html>
  );
}
