import prisma from "../lib/db";

async function main() {
  const eventCode = "MK258Z7";
  console.log(`Updating event ${eventCode}...`);

  const updated = await prisma.event.update({
    where: { eventCode },
    data: {
      isVotingOpen: true,
      isNominationOpen: false, // Ensure this is false to test Voting priority
      votingStartsAt: new Date(), // Set start to now
      votingEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // End in 7 days
    },
  });

  console.log(
    "Event updated:",
    updated.eventCode,
    "isVotingOpen:",
    updated.isVotingOpen
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
