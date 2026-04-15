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
      const value = parts.slice(1).join("=").trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  const code = "MG258J1";
  console.log(`Searching for event code: ${code}`);

  const event = await prisma.event.findUnique({
    where: { eventCode: code },
    select: {
      id: true,
      eventCode: true,
      title: true,
      status: true,
      type: true,
      isPublic: true,
      startDate: true,
      endDate: true,
      publishedAt: true,
    },
  });

  if (!event) {
    console.log("Event not found in DB.");
  } else {
    console.log("Event details:", JSON.stringify(event, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
