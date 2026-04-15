/**
 * Smoke tests for app/api/proxy/[...path]/route.ts
 *
 * Verifies: rate limiting, request forwarding, and error handling.
 * Backend fetch is mocked; no real network calls are made.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(
  path: string,
  method = "GET",
  ip = "1.2.3.4",
): NextRequest {
  const req = new NextRequest(`http://localhost/api/proxy/${path}`, { method });
  // Add a forwarded-for header so the rate limiter can identify the caller
  req.headers.set("x-forwarded-for", ip);
  return req;
}

function mockBackend(body: object, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: async () => body,
    }),
  );
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("Proxy route handler", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear the in-memory rate-limit store between tests
    vi.unstubAllGlobals();
    vi.stubEnv("API_URL", "https://backend.test/api");
  });

  it("forwards a GET request and returns the backend response", async () => {
    mockBackend({ success: true, data: { id: "1" } });

    const { GET } = await import("../app/api/proxy/[...path]/route");
    const req = makeRequest("events/abc123");
    const res = await GET(req, { params: Promise.resolve({ path: ["events", "abc123"] }) });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ success: true, data: { id: "1" } });
  });

  it("returns 502 when the backend is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const { GET } = await import("../app/api/proxy/[...path]/route");
    const req = makeRequest("events/abc123");
    const res = await GET(req, { params: Promise.resolve({ path: ["events", "abc123"] }) });

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("forwards backend error status codes unchanged", async () => {
    mockBackend({ success: false, message: "Not found" }, 404);

    const { GET } = await import("../app/api/proxy/[...path]/route");
    const req = makeRequest("events/missing");
    const res = await GET(req, { params: Promise.resolve({ path: ["events", "missing"] }) });

    expect(res.status).toBe(404);
  });

  it("returns 429 after exceeding the rate limit", async () => {
    mockBackend({ success: true });

    const { GET } = await import("../app/api/proxy/[...path]/route");

    // Exhaust the 120 req/min window from the same IP
    const ip = "rate-limit-test-ip";
    const requests = Array.from({ length: 121 }, (_, i) =>
      GET(makeRequest("events", "GET", ip), {
        params: Promise.resolve({ path: ["events"] }),
      }),
    );
    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);

    expect(statuses.filter((s) => s === 429).length).toBeGreaterThan(0);
    expect(statuses.filter((s) => s === 200).length).toBeLessThanOrEqual(120);
  });
});
