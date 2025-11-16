"use client";

const devApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const isProduction = process.env.NODE_ENV === "production";
const devBaseUrl = devApiUrl.replace(/\/$/, "");
const shouldProxyBackendCalls = isProduction && devBaseUrl.startsWith("http://");

function buildRequestUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith("/api/")) {
    if (isProduction) {
      return normalizedPath;
    }
    const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${frontendUrl.replace(/\/$/, "")}${normalizedPath}`;
  }

  if (shouldProxyBackendCalls) {
    return `/api/proxy${normalizedPath}`;
  }

  return `${devBaseUrl}${normalizedPath}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  const url = buildRequestUrl(path);

  if (!isProduction && !url.startsWith("http://") && !url.startsWith("https://")) {
    const errorMsg = `Invalid URL built from path "${path}": "${url}"`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...headers,
    },
    cache: "no-store",
  };

  if (body !== undefined) {
    if (!(headers?.["Content-Type"]?.includes("multipart/form-data"))) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      };
      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.body = body as BodyInit;
    }
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (!text) {
      return null as unknown as T;
    }
    return JSON.parse(text) as T;
  }

  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, headers?: Record<string, string>): Promise<T> {
  return request<T>("GET", path, undefined, headers);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return request<T>("POST", path, body, headers);
}

export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
  headers?: Record<string, string>
): Promise<T> {
  const url = buildRequestUrl(path);

  if (!isProduction && !url.startsWith("http://") && !url.startsWith("https://")) {
    const errorMsg = `Invalid URL built from path "${path}": "${url}"`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
    },
    body: formData,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (!text) {
      return null as unknown as T;
    }
    return JSON.parse(text) as T;
  }

  return (await res.json()) as T;
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return request<T>("PUT", path, body, headers);
}

export async function apiDelete<T>(
  path: string,
  headers?: Record<string, string>
): Promise<T> {
  return request<T>("DELETE", path, undefined, headers);
}
