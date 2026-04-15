import crypto from "crypto";
import { verifyWebhookSignature } from "../lib/payments/security";

// Mock Environment
const SECRET = "test_secret_key";
const PAYLOAD = JSON.stringify({
  event: "charge.success",
  data: { reference: "TEST-REF-123" },
});

function runTests() {
  console.log("🔒 Running Webhook Security Verification...");

  // 1. Test Valid Signature
  const validSig = crypto
    .createHmac("sha512", SECRET)
    .update(PAYLOAD)
    .digest("hex");

  const isValid = verifyWebhookSignature(PAYLOAD, validSig, SECRET);
  if (isValid) console.log("✅ Valid Signature Test Passed");
  else console.error("❌ Valid Signature Test Failed");

  // 2. Test Invalid Signature
  const isInvalid = verifyWebhookSignature(PAYLOAD, "invalid_sig", SECRET);
  if (!isInvalid) console.log("✅ Invalid Signature Test Passed");
  else console.error("❌ Invalid Signature Test Failed (Should have rejected)");

  // 3. Test Wrong Secret
  const isWrongSecret = verifyWebhookSignature(
    PAYLOAD,
    validSig,
    "wrong_secret"
  );
  if (!isWrongSecret) console.log("✅ Wrong Secret Test Passed");
  else console.error("❌ Wrong Secret Test Failed (Should have rejected)");

  console.log("🎉 Security Utility Verification Complete.");
}

runTests();
