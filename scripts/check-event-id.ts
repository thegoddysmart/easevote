import { PrismaClient } from "@prisma/client";

import fs from "fs";
import path from "path";

// Load .env manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ""); // Remove quotes
      process.env[key] = value;
    }
  });
} else {
  console.log("No .env file found at " + envPath);
}

const prisma = new PrismaClient();

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.log("Please provide an event ID");
    return;
  }

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    console.log("Event not found by ID. Trying by Code...");
    const eventByCode = await prisma.event.findUnique({
      where: { eventCode: id },
    });
    if (eventByCode) {
      console.log("Found by code:", eventByCode);
    } else {
      console.log("Not found.");
    }
  } else {
    console.log("Event Found:", event);
  }
}

main();
