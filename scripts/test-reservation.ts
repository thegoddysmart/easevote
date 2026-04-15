import "dotenv/config";
import { createTicketReservation } from "../lib/ticketing/reservation";
import prisma from "../lib/db";

async function testReservation() {
  console.log("--- Starting Reservation Test ---");
  try {
    // 1. Get a test ticket type
    const ticketType = await prisma.ticketType.findFirst({
      where: { isActive: true },
    });

    if (!ticketType) {
      console.log(
        "No active ticket types found. Please ensure seed data exists."
      );
      return;
    }

    console.log(
      `Testing reservation for: ${ticketType.name} (ID: ${ticketType.id})`
    );

    // 2. Attempt reservation
    const start = Date.now();
    const reservation = await createTicketReservation(
      ticketType.id,
      1,
      10,
      "TEST-REF-" + start
    );
    const end = Date.now();

    console.log("Reservation Successful!");
    console.log("Reservation ID:", reservation.id);
    console.log("Time Taken:", end - start, "ms");
  } catch (err: any) {
    console.error("Test Failed!");
    console.error("Error Message:", err.message);
    console.error("Stack:", err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testReservation();
