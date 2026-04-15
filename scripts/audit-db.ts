import "dotenv/config";
import prisma from "../lib/db";

async function auditDatabase() {
  console.log("🔍 Starting Database Audit...\n");

  let discrepancies = 0;

  // CHECK 1: Event Totals vs Aggregates
  console.log("--- 1. Checking Event Aggregates ---");
  const events = await prisma.event.findMany({
    select: { id: true, title: true, totalVotes: true, totalRevenue: true },
  });

  for (const event of events) {
    // FIX: Use aggregate sum, not count
    const votes = await prisma.vote.aggregate({
      where: { candidate: { category: { eventId: event.id } } },
      _sum: { quantity: true },
    });

    const actualVotes = votes._sum.quantity || 0;

    const revenue = await prisma.transaction.aggregate({
      where: { eventId: event.id, status: "SUCCESS" },
      _sum: { amount: true },
    });

    const actualRevenue = Number(revenue._sum.amount || 0);

    if (event.totalVotes !== actualVotes) {
      console.error(
        `❌ [Event: ${event.title}] Vote Mismatch: DB=${event.totalVotes}, Actual=${actualVotes}`
      );
      discrepancies++;
    }

    if (Number(event.totalRevenue) !== actualRevenue) {
      console.error(
        `❌ [Event: ${event.title}] Revenue Mismatch: DB=${event.totalRevenue}, Actual=${actualRevenue}`
      );
      discrepancies++;
    }
  }

  // CHECK 2: Candidate Vote Counts
  console.log("\n--- 2. Checking Candidate Vote Counts ---");
  const candidates = await prisma.candidate.findMany({
    select: { id: true, name: true, voteCount: true },
  });

  for (const c of candidates) {
    const actual = await prisma.vote.aggregate({
      where: { candidateId: c.id },
      _sum: { quantity: true },
    });
    const count = actual._sum.quantity || 0;
    if (c.voteCount !== count) {
      console.error(
        `❌ [Candidate: ${c.name}] Count Mismatch: DB=${c.voteCount}, Actual=${count}`
      );
      discrepancies++;
    }
  }

  // CHECK 3: Orphaned Votes (No Transaction or Candidate)
  console.log("\n--- 3. Checking for Orphaned Records ---");
  const invalidVotes = await prisma.vote.findMany({
    where: {
      transaction: {
        status: { not: "SUCCESS" },
      },
    },
    select: {
      id: true,
      transactionId: true,
      transaction: { select: { status: true } },
    },
  });

  if (invalidVotes.length > 0) {
    console.error(
      `❌ Found ${invalidVotes.length} votes linked to NON-SUCCESS transactions!`
    );
    invalidVotes.forEach((v) =>
      console.log(
        `   - Vote ${v.id} (Tx: ${v.transactionId}, Status: ${v.transaction.status})`
      )
    );
    discrepancies++;
  }

  // CHECK 4: Transaction Status Integrity
  const emptySuccessTx = await prisma.transaction.findMany({
    where: {
      type: "VOTE",
      status: "SUCCESS",
      votes: { none: {} },
    },
    select: { id: true, reference: true },
  });

  if (emptySuccessTx.length > 0) {
    console.error(
      `❌ Found ${emptySuccessTx.length} SUCCESS VOTE transactions with NO associated Vote records!`
    );
    emptySuccessTx.forEach((t) =>
      console.log(`   - Tx ${t.reference} (${t.id})`)
    );
    discrepancies++;
  }

  console.log(`\nAudit Complete! Found ${discrepancies} potential issues.`);
  if (discrepancies === 0)
    console.log("✅ Database appears healthy and consistent.");
}

auditDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
