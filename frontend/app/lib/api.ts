// Tiny fetch wrapper for your backend
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Request failed");
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  post: request,
};
