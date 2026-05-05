"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Database, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { queryRag, ingestSubscriptionData } from "@/actions/rag.actions";

export type ChatbotWidgetProps = {
  userRole?: "ADMIN" | "STUDENT";
};

type Message = {
  id: string;
  author: "assistant" | "user";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    author: "assistant",
    content:
      "Hi there! Ask me about subscription plans, course access, or your iLearn features. Try: \"What subscription plans are available?\"",
  },
];

export default function ChatbotWidget({ userRole }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const roleLabel = useMemo(() => {
    if (userRole === "ADMIN") return "Admin";
    if (userRole === "STUDENT") return "Student";
    return "Guest";
  }, [userRole]);

  const askSampleQuery = async () => {
    const sample = "Tell me about the available subscription plans.";
    setInput(sample);
    await sendMessage(sample);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await queryRag(text.trim());
      const responseText =
        typeof result?.answer === "string"
          ? result.answer
          : JSON.stringify(result?.answer ?? "", null, 2);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        author: "assistant",
        content: responseText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (result?.answer && result?.sources?.length) {
        setSyncMessage(
          `Found ${result.sources.length} source(s). Use the assistant to explore subscription details or ask for plan comparisons.`,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong while querying the assistant.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(input);
  };

  const handleSync = async () => {
    if (userRole !== "ADMIN") {
      setError("Only admins can sync subscription data.");
      return;
    }

    const confirmed = window.confirm(
      "This will refresh the subscription knowledge base from the backend. Do you want to continue?",
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSyncMessage(null);

    try {
      await ingestSubscriptionData();
      setSyncMessage("Subscription data sync completed successfully.");
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-sync-${Date.now()}`,
          author: "assistant",
          content:
            "Subscription data sync is complete. You can now ask updated questions about plans and subscriptions.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync subscription data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col items-end">
      <div
        className={`w-full rounded-3xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur transition-all duration-200 ${
          isOpen ? "max-h-[80vh]" : "max-h-16"
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-3xl bg-primary px-4 py-3 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">iLearn AI Assistant</p>
              <p className="text-xs text-primary/80">Role: {roleLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {userRole === "ADMIN" ? (
              <Button
                size="xs"
                variant="secondary"
                onClick={handleSync}
                disabled={loading}
                className="hidden sm:inline-flex"
              >
                <Database className="h-4 w-4" />
                Sync
              </Button>
            ) : null}
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/20"
              aria-label={isOpen ? "Close assistant" : "Open assistant"}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isOpen ? (
          <div className="space-y-3 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl p-3 shadow-sm ${
                    message.author === "assistant"
                      ? "bg-muted/80 text-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <div className="text-sm leading-6">{message.content}</div>
                </div>
              ))}
            </div>

            {syncMessage ? (
              <div className="rounded-2xl border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-secondary">
                {syncMessage}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="space-y-3">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about subscription plans, payments, or course access..."
                rows={3}
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={askSampleQuery}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Ask about plans
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Sending..." : "Send"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-2xl border border-input/70 bg-muted/80 px-3 py-2 text-xs text-muted-foreground">
                Admin sync is only available to admins. All users can ask questions.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
            <span>Tap to chat with the AI assistant</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
