/**
 * Integration tests for app/api/webhooks/payment/route.ts
 *
 * Verifies: header forwarding, backend forwarding, error handling.
 * The backend fetch is fully mocked — no real network calls.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeWebhookRequest(
  body: object,
  extraHeaders?: Record<string, string>,
): NextRequest {
  const req = new NextRequest("http://localhost/api/webhooks/payment", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "x-paystack-signature": "sha512=abc123def",
      ...extraHeaders,
    },
  });
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

describe("Payment webhook route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.stubEnv("API_URL", "https://backend.test/api");
  });

  it("forwards the webhook body to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ received: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("../app/api/webhooks/payment/route");
    const payload = { event: "charge.success", data: { reference: "ref-123" } };
    const req = makeWebhookRequest(payload);
    const res = await POST(req);

    expect(res.status).toBe(200);

    // Verify the backend was called with the webhook URL
    expect(fetchMock).toHaveBeenCalledOnce();
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(calledUrl).toContain("/webhooks/payment");
    expect(calledInit.method).toBe("POST");
  });

  it("forwards x- headers from the incoming request to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ received: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("../app/api/webhooks/payment/route");
    const req = makeWebhookRequest(
      { event: "charge.success" },
      { "x-paystack-signature": "sha512=test-sig", "x-request-id": "req-456" },
    );
    await POST(req);

    const [, calledInit] = fetchMock.mock.calls[0];
    expect(calledInit.headers["x-paystack-signature"]).toBe("sha512=test-sig");
    expect(calledInit.headers["x-request-id"]).toBe("req-456");
  });

  it("returns 500 when the backend is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const { POST } = await import("../app/api/webhooks/payment/route");
    const req = makeWebhookRequest({ event: "charge.success" });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal Server Error");
  });

  it("returns 500 when API_URL is not set", async () => {
    vi.stubEnv("API_URL", "");

    const { POST } = await import("../app/api/webhooks/payment/route");
    const req = makeWebhookRequest({ event: "charge.success" });
    const res = await POST(req);

    // The throw is caught by the route's own try/catch and becomes a 500
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal Server Error");
  });

  it("propagates non-200 status from the backend", async () => {
    mockBackend({ error: "Already processed" }, 409);

    const { POST } = await import("../app/api/webhooks/payment/route");
    const req = makeWebhookRequest({ event: "charge.success" });
    const res = await POST(req);

    expect(res.status).toBe(409);
  });
});
