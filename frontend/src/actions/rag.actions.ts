"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function apiFetch(path: string, init: RequestInit) {
  const cookieStore = await cookies();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const responseText = await res.text();
  const body = responseText
    ? (() => {
        try {
          return JSON.parse(responseText) as Record<string, unknown>;
        } catch {
          return null;
        }
      })()
    : null;

  if (!res.ok) {
    const message =
      (body && typeof body.message === "string" && body.message) ||
      (body && typeof body.error === "string" && body.error) ||
      responseText ||
      "RAG request failed";

    return { error: message };
  }

  return body?.data ?? body ?? {};
}

export type RagQueryResult = {
  answer?: unknown;
  sources?: unknown[];
  error?: string;
  [key: string]: unknown;
};

export async function queryRag(query: string) {
  if (!query || typeof query !== "string") {
    throw new Error("Query is required");
  }

  return apiFetch(`/rag/query`, {
    method: "POST",
    body: JSON.stringify({ query, limit: 5 }),
  }) as Promise<RagQueryResult>;
}

export async function ingestSubscriptionData() {
  const result = await apiFetch(`/rag/ingest`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (result && typeof result === "object" && "error" in result) {
    throw new Error(String(result.error));
  }

  return result;
}
