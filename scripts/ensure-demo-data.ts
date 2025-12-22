import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoBrandId = "brand-demo-123";
  const demoUserId = "user-demo-456";

  console.log("Checking/Creating Demo Data...");

  // 1. Ensure User exists (Conversation needs userId)
  const user = await prisma.user.upsert({
    where: { email: "demo-user@example.com" },
    update: {},
    create: {
      id: demoUserId,
      email: "demo-user@example.com",
      name: "Demo User",
      passwordHash: "mock-hash",
      role: "USER",
    },
  });
  console.log("User ensuring:", user.id);

  // 2. Ensure Brand exists (Conversation needs brandId)
  const brand = await prisma.brand.upsert({
    where: { slug: "demo-brand" },
    update: {},
    create: {
      id: demoBrandId,
      name: "Demo Brand Store",
      slug: "demo-brand",
      description: "A demo brand for testing chat",
      verified: true,
    },
  });
  console.log("Brand ensuring:", brand.id);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
