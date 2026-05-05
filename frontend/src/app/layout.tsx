import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import type { Metadata } from "next";

import { Toaster } from "sonner";
import QueryProviders from "@/providers/Queryprovider";
import ChatbotWidget from "@/components/ui/chatbot-widget";
import { userService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "iLearn — Student Dashboard for Learning & Subscriptions",
  description: "Manage your learning, subscriptions, and profile from a modern student dashboard.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await userService.getSession();
  const role = session?.data?.user?.role as "ADMIN" | "STUDENT" | undefined;

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProviders>
            {children}
            <ChatbotWidget userRole={role} />
            <Toaster position="top-right" richColors />
          </QueryProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
