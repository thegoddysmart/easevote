import "dotenv/config";
import prisma from "../lib/db";

async function backfill() {
  console.log("🔄 Starting Aggregate Backfill...");

  // 1. Reset Candidates
  console.log("... Recalculating Candidates");
  const candidates = await prisma.candidate.findMany({ select: { id: true } });
  for (const c of candidates) {
    const count = await prisma.vote.aggregate({
      where: { candidateId: c.id },
      _sum: { quantity: true },
    });
    await prisma.candidate.update({
      where: { id: c.id },
      data: { voteCount: count._sum.quantity || 0 },
    });
  }

  // 2. Reset Categories
  console.log("... Recalculating Categories");
  const categories = await prisma.eventCategory.findMany({
    select: { id: true },
  });
  for (const cat of categories) {
    const count = await prisma.candidate.aggregate({
      where: { categoryId: cat.id },
      _sum: { voteCount: true },
    });
    await prisma.eventCategory.update({
      where: { id: cat.id },
      data: { totalVotes: count._sum.voteCount || 0 },
    });
  }

  // 3. Reset Events
  console.log("... Recalculating Events");
  const events = await prisma.event.findMany({ select: { id: true } });
  for (const e of events) {
    const votes = await prisma.eventCategory.aggregate({
      where: { eventId: e.id },
      _sum: { totalVotes: true },
    });

    const revenue = await prisma.transaction.aggregate({
      where: { eventId: e.id, status: "SUCCESS" },
      _sum: { amount: true },
    });

    await prisma.event.update({
      where: { id: e.id },
      data: {
        totalVotes: votes._sum.totalVotes || 0,
        totalRevenue: revenue._sum.amount || 0,
      },
    });
  }

  // 4. Reset Organizers
  console.log("... Recalculating Organizers");
  const organizers = await prisma.organizerProfile.findMany({
    select: { id: true },
  });
  for (const org of organizers) {
    const revenue = await prisma.event.aggregate({
      where: { organizerId: org.id },
      _sum: { totalRevenue: true },
    });

    await prisma.organizerProfile.update({
      where: { id: org.id },
      data: { totalRevenue: revenue._sum.totalRevenue || 0 },
    });
  }

  console.log("✅ Backfill Complete!");
}

backfill()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
