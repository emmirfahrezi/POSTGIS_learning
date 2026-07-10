import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Menyimpan semua data mentah ke dalam sebuah array agar kode lebih rapi
const seedData = [
  {
    user: { email: 'admin@example.com', name: 'Admin User', password: 'adminpassword123' },
    location: { 
      name: 'Monumen Nasional', 
      address: 'Gambir, Jakarta Pusat', 
      geojson: { type: 'Point', coordinates: [106.827153, -6.175392] } 
    }
  },
  {
    user: { email: 'user@example.com', name: 'Regular User', password: 'userpassword123' },
    location: { 
      name: 'Bundaran HI', 
      address: 'Menteng, Jakarta Pusat', 
      geojson: { type: 'Point', coordinates: [106.822896, -6.194709] } 
    }
  },
  {
    user: { email: 'gbk@example.com', name: 'Manajer GBK', password: 'password123' },
    location: { 
      name: 'Kawasan GBK', 
      address: 'Senayan', 
      geojson: { 
        type: 'Polygon', 
        coordinates: [[[106.801, -6.218], [106.803, -6.218], [106.803, -6.220], [106.801, -6.220], [106.801, -6.218]]] 
      } 
    }
  },
  {
    user: { email: 'tmii@example.com', name: 'Manajer TMII', password: 'password123' },
    location: { 
      name: 'Kawasan TMII', 
      address: 'Jakarta Timur', 
      geojson: { 
        type: 'Polygon', 
        coordinates: [[[106.885, -6.300], [106.895, -6.300], [106.895, -6.310], [106.885, -6.310], [106.885, -6.300]]] 
      } 
    }
  },
  {
    user: { email: 'sudirman@example.com', name: 'Dinas Rute Sudirman', password: 'password123' },
    location: { 
      name: 'Rute Sudirman', 
      address: 'Jakarta Selatan', 
      geojson: { 
        type: 'LineString', 
        coordinates: [[106.822, -6.200], [106.818, -6.215], [106.815, -6.225]] 
      } 
    }
  },
  {
    user: { email: 'mrt@example.com', name: 'Operator MRT', password: 'password123' },
    location: { 
      name: 'Jalur MRT Bundaran HI - Lebak Bulus', 
      address: 'Lintas Jakarta', 
      geojson: { 
        type: 'LineString', 
        coordinates: [[106.822, -6.195], [106.815, -6.225], [106.790, -6.275], [106.775, -6.290]] 
      } 
    }
  },
  {
    user: { email: 'transjakarta@example.com', name: 'Operator TJ', password: 'password123' },
    location: { 
      name: 'Titik Halte TransJakarta', 
      address: 'Koridor 1', 
      geojson: { 
        type: 'MultiPoint', 
        coordinates: [[106.823, -6.193], [106.824, -6.183], [106.825, -6.173]] 
      } 
    }
  }
];

async function main() {
  console.log('Menjalankan Seeding Database secara dinamis...');

  // Melakukan perulangan (loop) untuk menyuntikkan semua data di atas
  for (const item of seedData) {
    // 1. Buat atau perbarui User
    const user = await prisma.user.upsert({
      where: { email: item.user.email },
      update: {},
      create: item.user,
    });

    // 2. Buat atau perbarui Lokasi dengan Raw SQL PostGIS
    const geojsonStr = JSON.stringify(item.location.geojson);
    await prisma.$executeRaw`
      INSERT INTO "Location" ("userId", "name", "address", "geom", "updatedAt")
      VALUES (
        ${user.id}, 
        ${item.location.name}, 
        ${item.location.address}, 
        ST_SetSRID(ST_GeomFromGeoJSON(${geojsonStr}), 4326), 
        NOW()
      )
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "name" = EXCLUDED."name",
        "address" = EXCLUDED."address",
        "geom" = EXCLUDED."geom",
        "updatedAt" = NOW();
    `;
    
    console.log(`✅ Tersimpan: ${item.user.name} (${item.location.geojson.type})`);
  }

  console.log('🎉 Seeding selesai! Total 7 User beserta variasi Lokasinya berhasil ditambahkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
