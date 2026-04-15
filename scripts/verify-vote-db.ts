import "dotenv/config";
import prisma from "../lib/db";

async function verifyLastVote() {
  console.log("🔍 Verifying Last Vote & Transaction...");

  try {
    // 1. Fetch Last Transaction
    const lastTx = await prisma.transaction.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        votes: true,
      },
    });

    if (!lastTx) {
      console.log("❌ No transactions found.");
      return;
    }

    console.log("\n💰 [Latest Transaction]");
    console.log("ID:", lastTx.id);
    console.log("Reference:", lastTx.reference);
    console.log("Amount:", lastTx.amount, lastTx.currency);
    console.log("Status:", lastTx.status);
    console.log("Type:", lastTx.type);
    console.log("Metadata:", JSON.stringify(lastTx.metadata, null, 2));

    // 2. Fetch Associated Votes
    const votes = await prisma.vote.findMany({
      where: { transactionId: lastTx.id },
    });

    if (votes.length === 0) {
      console.log(
        "\n⚠️ No votes found for this transaction (Only acceptable if transaction failed or is pending)."
      );
    } else {
      console.log(`\n🗳️ [Associated Votes] (Count: ${votes.length})`);
      votes.forEach((vote, i) => {
        console.log(`--- Vote ${i + 1} ---`);
        console.log("ID:", vote.id);
        console.log("Candidate ID:", vote.candidateId);
        console.log("Quantity:", vote.quantity);
        console.log("Voter Name:", vote.voterName);
      });
    }
  } catch (error) {
    console.error("Script Execution Error:", error);
  }
}

verifyLastVote()
  .catch((e) => {
    console.error("Top-Level Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
