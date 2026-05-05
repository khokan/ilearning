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

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.message ?? "RAG request failed");
  }

  return body.data ?? body;
}

export async function queryRag(query: string) {
  if (!query || typeof query !== "string") {
    throw new Error("Query is required");
  }

  return apiFetch(`/rag/query`, {
    method: "POST",
    body: JSON.stringify({ query, limit: 5 }),
  });
}

export async function ingestSubscriptionData() {
  return apiFetch(`/rag/ingest`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
