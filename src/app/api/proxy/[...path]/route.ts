import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleProxy(
  request: NextRequest,
  params: Promise<{ path?: string[] }>
) {
  const resolvedParams = await params;
  const pathSegments = resolvedParams.path ?? [];
  const targetPath = `/${pathSegments.join("/")}`;
  const search = request.nextUrl.search;
  const targetUrl = `${API_URL}${targetPath}${search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.set("accept-encoding", "identity");

  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > 0) {
      body = buffer;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    const proxyResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
    });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "content-encoding") {
        return;
      }
      proxyResponse.headers.set(key, value);
    });

    return proxyResponse;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Proxy request failed for ${targetUrl}:`, errorMessage);
    return NextResponse.json(
      { error: "Failed to proxy request", details: errorMessage, targetUrl },
      { status: 502 }
    );
  }
}

export const GET = (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) => handleProxy(request, context.params);

export const POST = (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) => handleProxy(request, context.params);

export const PUT = (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) => handleProxy(request, context.params);

export const PATCH = (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) => handleProxy(request, context.params);

export const DELETE = (
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) => handleProxy(request, context.params);
