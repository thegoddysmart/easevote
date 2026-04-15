import prisma from "../lib/db";

async function diagnose() {
  console.log("--- Prisma Diagnosis ---");
  try {
    const models = Object.keys(prisma).filter(
      (k) => !k.startsWith("$") && !k.startsWith("_")
    );
    console.log("Available Models:", models.join(", "));

    if (models.includes("ticketType")) {
      console.log("ticketType model found.");
    } else {
      console.log("ticketType model MISSING!");
    }

    if (models.includes("ticketReservation")) {
      console.log("ticketReservation model found.");
    } else {
      console.log("ticketReservation model MISSING!");
    }
  } catch (err: any) {
    console.error("Diagnosis Failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
