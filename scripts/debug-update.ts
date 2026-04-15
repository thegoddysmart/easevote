import { PrismaClient } from "@prisma/client";

async function run() {
  console.log("Checking Environment...");
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in process.env");
    return;
  }
  console.log("DATABASE_URL found:", url.substring(0, 15) + "...");

  const prisma = new PrismaClient(); // Direct instantiation without adapter

  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected. Fetching Event...");
    const event = await prisma.event.findUnique({
      where: { id: "cmjgssmqq001aggv240yr7d2v" },
      select: {
        id: true,
        title: true,
        categories: { select: { id: true, name: true, candidates: true } },
      },
    });
    if (event) {
      console.log("Success! Event:", event.title);
      console.log("Categories:", event.categories.length);
      if (event.categories.length > 0) {
        console.log("Sample Category:", event.categories[0].name);
        console.log(
          "Sample Candidate Count:",
          event.categories[0].candidates.length
        );
      }
    } else {
      console.log("Event not found");
    }
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
