import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = "admin@easevote.com";
  const password = "Password@123";
  const name = "Super Admin";

  console.log(`Creating superadmin account...`);
  console.log(`Email: ${email}`);

  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
    },
    create: {
      email,
      name,
      passwordHash: hashedPassword,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`Superadmin created/updated successfully!`);
  console.log(`ID: ${user.id}`);
  console.log(`Use the following credentials to login:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
