import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

// GET: session checks, CSRF token, providers — no rate limit needed
export const GET = handler;

// POST: login, signout, callbacks — rate limit login attempts
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> },
) {
  const params = await context.params;
  const action = params.nextauth?.[0];

  // Only rate limit the sign-in action, not signout/callback/etc.
  if (action === "signin" || action === "credentials") {
    const ip = getClientIp(req);
    const result = rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000); // 10 per 15 min

    if (!result.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((result.resetAt - Date.now()) / 1000),
            ),
          },
        },
      );
    }
  }

  return handler(req, context);
}
