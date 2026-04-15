import "dotenv/config";
import db from "../lib/db";

async function main() {
  console.log("Applying DB Patches...");

  try {
    // 1. OrganizerProfile.pendingBalance
    await db.$executeRawUnsafe(`
        ALTER TABLE "OrganizerProfile" 
        ADD COLUMN IF NOT EXISTS "pendingBalance" DECIMAL(12,2) NOT NULL DEFAULT 0;
      `);
    console.log("✅ Added pendingBalance to OrganizerProfile");

    // 2. Payout.method
    await db.$executeRawUnsafe(`
        ALTER TABLE "Payout" 
        ADD COLUMN IF NOT EXISTS "method" TEXT NOT NULL DEFAULT 'BANK';
      `);
    console.log("✅ Added method to Payout");
  } catch (e) {
    console.error("Patch Failed", e);
  }
}

main();
