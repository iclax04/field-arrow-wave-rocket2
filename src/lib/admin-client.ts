export async function adminFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
  });
  const type = response.headers.get("content-type") || "";
  if (type.includes("text/csv")) return (await response.text()) as T;
  const data = (await response.json().catch(() => ({}))) as { error?: string; status?: number };
  if (!response.ok || data.error) {
    if (data.status === 401 || response.status === 401) window.location.replace("/admin/login");
    if (data.status === 403 && data.error?.toLowerCase().includes("password")) window.location.replace("/admin/password");
    throw new Error(data.error || "Request failed.");
  }
  return data as T;
}
