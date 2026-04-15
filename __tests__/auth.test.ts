/**
 * Unit tests for lib/auth.ts — authorizeCredentials
 *
 * Tests the credential validation logic in isolation.
 * The backend fetch is mocked via vi.stubGlobal.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

function makeOkResponse(body: object) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response;
}

function makeErrorResponse(status: number, body: object) {
  return {
    ok: false,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("authorizeCredentials", () => {
  let authorizeCredentials: (
    credentials: Record<string, string> | undefined,
  ) => Promise<unknown>;

  beforeEach(async () => {
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret-for-unit-tests");
    vi.resetModules();
    vi.unstubAllGlobals();
    const mod = await import("../lib/auth");
    authorizeCredentials = mod.authorizeCredentials;
  });

  it("throws when credentials are undefined", async () => {
    await expect(authorizeCredentials(undefined)).rejects.toThrow(
      "Email and password are required",
    );
  });

  it("throws when password is empty", async () => {
    await expect(
      authorizeCredentials({ email: "a@b.com", password: "" }),
    ).rejects.toThrow("Email and password are required");
  });

  it("throws when email is empty", async () => {
    await expect(
      authorizeCredentials({ email: "", password: "pass" }),
    ).rejects.toThrow("Email and password are required");
  });

  it("throws when backend returns success:false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeErrorResponse(401, { success: false, message: "Invalid credentials" }),
      ),
    );

    await expect(
      authorizeCredentials({ email: "a@b.com", password: "wrong" }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws when backend returns no token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeOkResponse({
          success: true,
          data: {
            token: "",
            user: { id: "1", email: "a@b.com", role: "ADMIN" },
          },
        }),
      ),
    );

    await expect(
      authorizeCredentials({ email: "a@b.com", password: "pass" }),
    ).rejects.toThrow("Invalid response from server");
  });

  it("throws when backend returns no user", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeOkResponse({
          success: true,
          data: { token: "jwt.token", user: null },
        }),
      ),
    );

    await expect(
      authorizeCredentials({ email: "a@b.com", password: "pass" }),
    ).rejects.toThrow("Invalid response from server");
  });

  it("returns a user object on successful login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeOkResponse({
          success: true,
          data: {
            token: "jwt.token.here",
            user: {
              id: "user-123",
              email: "admin@easevotegh.com",
              fullName: "Test Admin",
              role: "ADMIN",
              status: "ACTIVE",
            },
          },
        }),
      ),
    );

    const result = await authorizeCredentials({
      email: "admin@easevotegh.com",
      password: "secret",
    });

    expect(result).toMatchObject({
      id: "user-123",
      email: "admin@easevotegh.com",
      role: "ADMIN",
      accessToken: "jwt.token.here",
    });
  });

  it("throws on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    await expect(
      authorizeCredentials({ email: "a@b.com", password: "pass" }),
    ).rejects.toThrow("Network error");
  });
});
