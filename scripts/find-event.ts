import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.findFirst({
    where: { eventCode: "MK258Z7" },
  });
  console.log(JSON.stringify(event, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
