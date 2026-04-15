import "dotenv/config";
import prisma from "../lib/db";

async function checkPrice() {
  const event = await prisma.event.findUnique({
    where: { eventCode: "MU25QYI" },
    select: { title: true, votePrice: true },
  });

  if (event) {
    console.log(`Event: ${event.title}`);
    console.log(`Current Vote Price: ${event.votePrice} GHS`);
  } else {
    console.log("Event not found.");
  }
}

checkPrice()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
