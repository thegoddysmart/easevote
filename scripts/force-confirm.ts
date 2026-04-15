if (typeof process.loadEnvFile === "function") {
  process.loadEnvFile();
}
import db from "../lib/db";
import { confirmTicketPurchase } from "../lib/ticketing/engine";

// Usage: npx tsx scripts/force-confirm.ts <REFERENCE>
const REFERENCE = process.argv[2] || "TIX-1766358510062-279"; // Default to the one user provided

async function main() {
  console.log(`🚀 Force Confirming Transaction: ${REFERENCE}`);

  const tx = await db.transaction.findUnique({
    where: { reference: REFERENCE },
  });

  if (!tx) {
    console.error("❌ Transaction not found!");
    process.exit(1);
  }

  if (tx.status === "SUCCESS") {
    console.log(
      "⚠️ Transaction is already SUCCESS. Running confirmation logic anyway to ensure tickets exist..."
    );
  } else {
    console.log(`Updating status from ${tx.status} to SUCCESS...`);
    await db.transaction.update({
      where: { id: tx.id },
      data: { status: "SUCCESS", paidAt: new Date() },
    });
  }

  try {
    const result = await confirmTicketPurchase(tx.id);
    console.log("✅ Confirmation Result:", result);
  } catch (error) {
    console.error("❌ Failed to fulfill tickets:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
