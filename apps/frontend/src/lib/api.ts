const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export async function api(
  input: string,
  init: RequestInit = {},
  { redirectOnAuth = true }: { redirectOnAuth?: boolean } = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${input}`, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    if (
      redirectOnAuth &&
      !path.startsWith("/login") &&
      !path.startsWith("/register")
    ) {
      window.location.assign("/login");
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res;
}
