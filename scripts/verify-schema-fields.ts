import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Manually parse .env file
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const [key, ...values] = line.split("=");
    const value = values.join("=");
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to database...");
  try {
    const event = await prisma.event.findFirst();

    if (event) {
      console.log("Event found:", event.title);
      // Cast to any to check RUNTIME existence even if Types are stale
      const e = event as any;
      console.log("nominationEndsAt (Runtime):", e.nominationEndsAt);
      console.log("votingEndsAt (Runtime):", e.votingEndsAt);
      console.log("isNominationOpen (Runtime):", e.isNominationOpen);

      // Check actual keys
      console.log(
        "Keys available:",
        Object.keys(event).filter(
          (k) => k.includes("Nomination") || k.includes("Voting")
        )
      );
    } else {
      console.log("No event found.");
    }
  } catch (error) {
    console.error("Query failed:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
