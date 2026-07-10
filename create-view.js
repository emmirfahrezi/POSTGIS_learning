const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
  console.log('Creating Debug View for Mentor...');
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE VIEW "Location_View_Debug" AS
    SELECT 
      id, 
      "userId", 
      name, 
      address, 
      ST_AsText(geom) AS geom_wkt,
      "createdAt", 
      "updatedAt"
    FROM "Location";
  `);
  console.log('View created successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
