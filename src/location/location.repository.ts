import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

/**
 * LocationRepository bertugas khusus untuk menangani semua operasi Database dan Raw SQL 
 * yang berkaitan dengan data lokasi dan fungsionalitas spasial PostGIS.
 */
@Injectable()
export class LocationRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Menyimpan atau memperbarui data lokasi pengguna (Upsert).
   * 
   * @param {number} userId - ID unik pengguna
   * @param {CreateLocationDto} createLocationDto - Data lokasi yang berisi nama, alamat, dan GeoJSON
   * @returns {Promise<void>}
   */
  async saveLocation(userId: number, createLocationDto: CreateLocationDto) {
    // Mengubah objek JSON dari DTO menjadi string agar bisa disisipkan ke query SQL
    const geojsonString = JSON.stringify(createLocationDto.geojson);
    
    // Mengeksekusi Raw Query SQL untuk operasi INSERT atau UPDATE (Upsert)
    await this.prisma.$executeRaw`
      INSERT INTO "Location" ("userId", "name", "address", "geom", "updatedAt")
      VALUES (
        ${userId}, 
        ${createLocationDto.name}, 
        ${createLocationDto.address}, 
        -- ST_GeomFromGeoJSON: Menyulap teks GeoJSON menjadi format Biner (Geometry)
        -- ST_SetSRID: Mengatur kode referensi bumi (4326 / GPS) ke geometri tersebut
        ST_SetSRID(ST_GeomFromGeoJSON(${geojsonString}), 4326),
        NOW()
      )
      -- Jika userId sudah ada di database, lakukan UPDATE (jangan buat data kembar)
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "name" = EXCLUDED."name",
        "address" = EXCLUDED."address",
        "geom" = EXCLUDED."geom",
        "updatedAt" = NOW();
    `;
  }

  /**
   * Mengambil data lokasi berdasarkan ID pengguna.
   * 
   * @param {number} userId - ID unik pengguna yang dicari
   * @returns {Promise<any | null>} Mengembalikan objek lokasi lengkap beserta GeoJSON-nya, atau null.
   */
  async getLocationByUserId(userId: number) {
    const result = await this.prisma.$queryRaw`
      SELECT 
        id, 
        "userId", 
        name, 
        address, 
        -- ST_AsGeoJSON: Mengubah wujud Biner (Geometry) menjadi teks JSON standar
        -- ::json : Memaksa PostgreSQL membacanya sebagai tipe JSON asli, bukan sekadar string
        ST_AsGeoJSON(geom)::json as geojson,
        "createdAt",
        "updatedAt"
      FROM "Location"
      WHERE "userId" = ${userId}
    `;

    // Mengambil elemen pertama dari hasil query karena $queryRaw selalu mengembalikan bentuk Array
    return (result as any[])[0] || null; 
  }

  /**
   * Mencari pengguna lain yang berada di sekitar radius tertentu menggunakan Index Spasial PostGIS.
   * 
   * @param {number} longitude - Garis bujur titik pusat pencarian
   * @param {number} latitude - Garis lintang titik pusat pencarian
   * @param {number} radiusInMeters - Jarak radius maksimum dalam satuan meter
   * @returns {Promise<any[]>} Array berisi daftar pengguna terdekat, diurutkan dari yang terdekat.
   */
  async findNearbyUsers(longitude: number, latitude: number, radiusInMeters: number) {
    return await this.prisma.$queryRaw`
      SELECT 
        "userId",
        name,
        address,
        ST_AsGeoJSON(geom)::json as geojson,
        -- ST_Distance: Menghitung jarak presisi (dalam meter) antara titik pusat dan lokasi user
        -- Parameter 'true' berarti menghitung jarak melengkung mengikuti bentuk permukaan bumi sesungguhnya
        ST_Distance(geom, ST_SetSRID(ST_MakePoint(${longitude}::float, ${latitude}::float), 4326), true) as "distanceInMeters"
      FROM "Location"
      WHERE 
        -- ST_DWithin: Deteksi super cepat apakah lokasi user berada di DALAM radius titik pusat
        ST_DWithin(
          geom, 
          -- Titik pusat dibuat on-the-fly dari koordinat longitude & latitude
          ST_SetSRID(ST_MakePoint(${longitude}::float, ${latitude}::float), 4326), 
          ${radiusInMeters}::float, 
          true
        )
      -- Mengurutkan hasil pencarian mulai dari yang paling dekat dengan titik pusat
      ORDER BY "distanceInMeters" ASC;
    `;
  }
}
