import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing Prisma Connection...");
    const count = await prisma.conversation.count();
    console.log("Conversation count:", count);

    console.log("Attempting to find demo conversation...");
    const demo = await prisma.conversation.findFirst({
      where: { userId: "user-demo-456" },
    });
    console.log("Demo conversation:", demo);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
