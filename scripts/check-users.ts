import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  const profileCount = await prisma.organizerProfile.count();

  console.log(`Total Users: ${userCount}`);
  console.log(`Total Organizer Profiles: ${profileCount}`);

  const users = await prisma.user.findMany({
    include: { organizerProfile: true },
  });

  console.log("Users:", JSON.stringify(users, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
