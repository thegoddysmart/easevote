import { randomUUID } from "crypto";

// Attempt to load env vars
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch (e) {
    console.log("Note: .env file not found or couldn't be loaded natively.");
  }
}

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET_KEY;
const PORT = process.env.PORT || 3000;
// We assume localhost:3000 unless specified. In many environments NEXT_PUBLIC_APP_URL might affect this logic in the real app,
// but for this test we target localhost directly.
const BASE_URL = `http://localhost:${PORT}`;

console.log(`🔎 Testing Webhook on ${BASE_URL}`);
console.log(
  `🔑 Using Secret: ${
    WEBHOOK_SECRET ? WEBHOOK_SECRET.substring(0, 3) + "..." : "MISSING"
  }`
);

async function testWebhook() {
  if (!WEBHOOK_SECRET) {
    console.error("❌ WEBHOOK_SECRET_KEY is missing in environment variables!");
    return;
  }

  const payload = {
    event: "charge.success",
    data: {
      reference: `TEST-REF-${randomUUID()}`,
      status: "success",
      amount: 100,
      channel: "simulation_test",
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-easevote-signature": "invalid_sig_should_be_ignored",
        "x-simulation-key": WEBHOOK_SECRET, // The bypass key
      },
      body: JSON.stringify(payload),
    });

    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log(`📄 Response: ${text}`);

    if (response.ok) {
      console.log("✅ Webhook Connection SUCCEEDED!");
    } else {
      console.log("❌ Webhook Failed. Check server logs.");
    }
  } catch (error) {
    console.error("❌ Connection Error:", error);
    console.log("👉 Is the server running? (npm run dev)");
  }
}

testWebhook();
