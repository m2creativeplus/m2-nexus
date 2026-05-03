import { auth } from "@clerk/nextjs/server";

type ConvexHttpResult<T> = { value: T } | T;

function getConvexUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  return convexUrl;
}

async function getConvexAuthHeader() {
  // Convex Clerk integration typically uses a JWT template named "convex".
  const a = await auth();
  const token = await a.getToken({ template: "convex" });
  return token ? `Bearer ${token}` : undefined;
}

export async function convexQuery<T>(path: string, args: unknown): Promise<T> {
  const convexUrl = getConvexUrl();
  const bearer = await getConvexAuthHeader();
  const headers = new Headers({ "Content-Type": "application/json" });
  if (bearer) headers.set("Authorization", bearer);
  const res = await fetch(`${convexUrl}/api/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({ path, args, format: "json" }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Convex query failed (${res.status})`);
  const json: ConvexHttpResult<T> = await res.json();
  return (json as { value: T })?.value ?? (json as T);
}

export async function convexMutation<T>(path: string, args: unknown): Promise<T> {
  const convexUrl = getConvexUrl();
  const bearer = await getConvexAuthHeader();
  const headers = new Headers({ "Content-Type": "application/json" });
  if (bearer) headers.set("Authorization", bearer);
  const res = await fetch(`${convexUrl}/api/mutation`, {
    method: "POST",
    headers,
    body: JSON.stringify({ path, args, format: "json" }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Convex mutation failed (${res.status})`);
  const json: ConvexHttpResult<T> = await res.json();
  return (json as { value: T })?.value ?? (json as T);
}

