import { getPaymentGateway } from "../lib/payments/factory";
import db from "../lib/db";
import { POST as webhookHandler } from "../app/api/webhooks/payment/route";
import { NextRequest } from "next/server";

// ============================================
// MOCK & SETUP
// ============================================

// Mock global fetch to intercept webhook calls and route them to our handler
const originalFetch = global.fetch;
global.fetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const urlStr = url.toString();
  if (urlStr.includes("/api/webhooks/payment") && init?.method === "POST") {
    console.log(`[MOCK FETCH] Intercepted Webhook POST to ${urlStr}`);
    const body = init.body as string;

    // Create a mock NextRequest
    // We need to construct a URL that works
    const req = new NextRequest("http://localhost:3000/api/webhooks/payment", {
      method: "POST",
      body: body,
    });

    // Call the actual handler
    await webhookHandler(req);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }
  return originalFetch(url, init);
};

// ============================================
// TEST HELPERS
// ============================================

async function createTestEvent() {
  // Create a dummy organizer first if needed, but we'll try to find one
  let organizer = await db.organizerProfile.findFirst();
  if (!organizer) {
    throw new Error("No organizer found. Please seed db first.");
  }

  // Create Event
  const event = await db.event.create({
    data: {
      title: "Payment Test Event",
      eventCode: `TEST-${Date.now()}`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      organizerId: organizer.id,
      type: "VOTING",
      status: "LIVE",
    },
  });

  // Create Category & Candidate
  const category = await db.eventCategory.create({
    data: { name: "Test Cat", eventId: event.id },
  });

  const candidate = await db.candidate.create({
    data: {
      name: "Test Candidate",
      code: `TC-${Math.floor(Math.random() * 1000)}`,
      categoryId: category.id,
    },
  });

  return { event, candidate };
}

async function runTest(name: string, fn: () => Promise<void>) {
  console.log(`\n🔵 STARTING TEST: ${name}`);
  try {
    await fn();
    console.log(`✅ PASSED: ${name}`);
  } catch (e) {
    console.error(`❌ FAILED: ${name}`, e);
  }
}

// ============================================
// TESTS
// ============================================

async function main() {
  console.log("🚀 STARTING PAYMENT ENGINE TEST SUITE");

  const { event, candidate } = await createTestEvent();
  console.log(`setup: Created Event ${event.id} and Candidate ${candidate.id}`);

  // 1. FACTORY TEST
  await runTest("Factory returns correct provider", async () => {
    const gateway = getPaymentGateway("APPSN");
    if ((gateway as any).providerName !== "APPSN")
      throw new Error("Factory returned wrong provider");
  });

  // 2. APPSN MOBILE FLOW
  await runTest("AppsnMobile Flow (Init -> Webhook -> Success)", async () => {
    const gateway = getPaymentGateway("APPSN");
    const reference = `TEST-APPSN-${Date.now()}`;

    // Create DB Transaction (simulating API logic)
    await db.transaction.create({
      data: {
        reference,
        amount: 1,
        netAmount: 1,
        paymentMethod: "MOBILE_MONEY",
        paymentProvider: "APPSN",
        status: "PENDING",
        type: "VOTE",
        eventId: event.id,
        isSimulated: true,
        simulationProvider: "APPSN",
        metadata: {
          candidateId: candidate.id,
          quantity: 1,
        },
      },
    });
    console.log("   - Transaction Created (PENDING)");

    // Initialize
    await gateway.initializePayment({
      amount: 1,
      currency: "GHS",
      reference,
      phone: "0550000000",
      metadata: {},
    });
    console.log(
      "   - Gateway Initialized. Waiting for simulation delay (approx 5s)..."
    );

    // Wait 7s to be safe
    await new Promise((r) => setTimeout(r, 7000));

    // Verify
    const tx = await db.transaction.findUnique({ where: { reference } });
    if (tx?.status !== "SUCCESS")
      throw new Error(`Transaction status is ${tx?.status}, expected SUCCESS`);

    const cand = await db.candidate.findUnique({ where: { id: candidate.id } });
    if (cand?.voteCount === 0) throw new Error("Vote count did not increment");
  });

  // 3. PAYSTACK FLOW
  await runTest("Paystack Flow (Init -> Webhook -> Success)", async () => {
    const gateway = getPaymentGateway("PAYSTACK");
    const reference = `TEST-PSTK-${Date.now()}`;

    await db.transaction.create({
      data: {
        reference,
        amount: 2,
        netAmount: 2,
        paymentMethod: "CARD",
        paymentProvider: "PAYSTACK",
        status: "PENDING",
        type: "VOTE",
        eventId: event.id,
        isSimulated: true,
        simulationProvider: "PAYSTACK",
        metadata: {
          candidateId: candidate.id,
          quantity: 2,
        },
      },
    });

    await gateway.initializePayment({
      amount: 2,
      currency: "GHS",
      reference,
      email: "test@test.com",
      metadata: {},
    });
    console.log(
      "   - Gateway Initialized. Waiting for simulation delay (approx 3s)..."
    );

    await new Promise((r) => setTimeout(r, 5000));

    const tx = await db.transaction.findUnique({ where: { reference } });
    if (tx?.status !== "SUCCESS")
      throw new Error(`Transaction status is ${tx?.status}, expected SUCCESS`);
  });

  // 4. FAILURE FLOW (FORCED)
  await runTest(
    "Failure Flow (Force Failed -> Webhook -> FAILED)",
    async () => {
      const gateway = getPaymentGateway("APPSN");
      const reference = `TEST-FAIL-${Date.now()}`;

      await db.transaction.create({
        data: {
          reference,
          amount: 5,
          netAmount: 5,
          paymentMethod: "MOBILE_MONEY",
          paymentProvider: "APPSN",
          status: "PENDING",
          type: "VOTE",
          eventId: event.id,
          isSimulated: true,
          simulationProvider: "APPSN",
          metadata: {
            candidateId: candidate.id,
            quantity: 5,
          },
        },
      });

      await gateway.initializePayment({
        amount: 5,
        currency: "GHS",
        reference,
        phone: "0550000000",
        metadata: { _force_outcome: "FAILED" }, // <--- FORCE FAILURE
      });
      console.log(
        "   - Gateway Initialized (Forcing FAILURE). Waiting for delay..."
      );

      await new Promise((r) => setTimeout(r, 4000));

      const tx = await db.transaction.findUnique({ where: { reference } });
      if (tx?.status !== "FAILED")
        throw new Error(`Transaction status is ${tx?.status}, expected FAILED`);
      console.log("   - Transaction correctly updated to FAILED");
    }
  );

  console.log("\n✨ ALL TESTS COMPLETED");
  process.exit(0);
}

main().catch(console.error);
