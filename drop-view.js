const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`DROP VIEW IF EXISTS "Location_View_Debug";`);
  console.log("View Location_View_Debug dropped successfully.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
