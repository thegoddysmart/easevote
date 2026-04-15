import "dotenv/config";
import prisma from "../lib/db";

async function diagnoseRecord() {
  console.log("--- TicketType Record Diagnosis ---");
  try {
    // Try a raw query to see what the columns are
    const result = await prisma.$queryRaw`SELECT * FROM "TicketType" LIMIT 1`;
    console.log(
      "Raw Record Keys:",
      result && Array.isArray(result) && result[0]
        ? Object.keys(result[0])
        : "No records found"
    );

    // Try to fetch without where clause
    const tt = await prisma.ticketType.findFirst();
    console.log("Prisma fetch successful:", !!tt);
    if (tt) {
      console.log("Prisma Record Keys:", Object.keys(tt));
    }
  } catch (err: any) {
    console.error("Diagnosis Failed:", err.message);
    if (err.code) console.log("Prisma Error Code:", err.code);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseRecord();
