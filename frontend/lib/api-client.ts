/**
 * ANVYRA API Client
 * Centralized fetch wrapper with automatic JWT token management.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

// ─── Token helpers (browser-only) ────────────────────────────────────────────
const TOKEN_KEY = "anvyra_access_token";
const REFRESH_KEY = "anvyra_refresh_token";

export const tokenStorage = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null,
  set: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Request options ─────────────────────────────────────────────────────────
type RequestOptions = {
  auth?: boolean;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
};

// ─── Core fetch ──────────────────────────────────────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, body, method = "GET", params, signal } = options;

  // Build URL with query params
  const url = new URL(path.startsWith("/") ? path : `/${path}`, API_BASE);
  if (API_BASE.startsWith("http")) {
    // Replace base properly for relative paths
  }
  const fullUrl = `${API_BASE}${path.startsWith("/") ? path : "/" + path}`;
  const urlObj = new URL(fullUrl);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = tokenStorage.getAccess();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(urlObj.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      // Retry with new token
      headers["Authorization"] = `Bearer ${tokenStorage.getAccess()}`;
      const retryRes = await fetch(urlObj.toString(), {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });
      return handleResponse<T>(retryRes);
    }
    // Refresh failed — clear tokens, let consumer handle
    tokenStorage.clear();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  return handleResponse<T>(res);
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message =
      data?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, data?.errors);
  }

  return data as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    // Only update access token; refresh token stays the same
    localStorage.setItem("anvyra_access_token", data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Typed endpoint wrappers ─────────────────────────────────────────────────
export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "GET" }),

  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...opts, method: "POST", body }),

  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...opts, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    apiFetch<T>(path, { ...opts, method: "PATCH", body }),

  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...opts, method: "DELETE" }),
};
