import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.room.createMany({
    data: Array.from({ length: 6 }, (_, index) => ({
      number: index + 1,
      name: `Room ${index + 1}`,
    })),
    skipDuplicates: true,
  });

  await prisma.setting.upsert({
    where: { id: "default-settings" },
    update: {},
    create: {
      id: "default-settings",
      centerName: "Physio Center",
      currency: "EGP",
      defaultLanguage: "ar-EG",
      timezone: "Africa/Cairo",
    },
  });
}

seed()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
