"use client";

const STORAGE_KEY = "admin_password";

export function getAdminPassword(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) || "";
}

export function setAdminPassword(password: string): void {
  window.localStorage.setItem(STORAGE_KEY, password);
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "x-admin-password": getAdminPassword(),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }
  return res.json();
}
