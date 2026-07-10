const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: 'postgresql://postgres:mirrrpostgre@localhost:5432/strukturnest?schema=public' });
const adapter = new PrismaPg(pool);

class PrismaService extends PrismaClient {
    constructor() {
        super({ adapter });
    }
}

console.log("Instantiating PrismaService with adapter...");
const p2 = new PrismaService();
console.log("Success p2");
