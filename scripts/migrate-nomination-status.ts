import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Manually parse .env to ensure DATABASE_URL is loaded
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      // Join rest in case value has =
      const value = parts.slice(1).join("=").trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  console.log("Migrating Nomination Statuses...");

  // Update all nominations with status 'SUBMITTED' to 'PENDING'
  // Note: We cast to 'any' or raw because Types might not perfectly reflect the intermediate state in strict mode,
  // but Prisma Client should support both now as per schema.

  const result = await prisma.nomination.updateMany({
    where: {
      status: "SUBMITTED" as any,
    },
    data: {
      status: "PENDING",
    },
  });

  console.log(
    `Migrated ${result.count} nominations from SUBMITTED to PENDING.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
