import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

seed().finally(() => prisma.$disconnect());
