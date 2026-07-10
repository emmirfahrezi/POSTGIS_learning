import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Skema validasi dasar untuk mendeteksi bahwa input Frontend benar-benar 
 * menggunakan format struktur standar "GeoJSON".
 */
export const geoJsonSchema = z.object({
  type: z.enum(['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon']),
  coordinates: z.any(), // Akan tervalidasi secara alami oleh PostgreSQL
});

/**
 * Skema validasi Zod untuk entitas Lokasi.
 * Memastikan setiap pembuatan lokasi harus menyertakan nama, alamat, 
 * dan properti `geojson` yang valid.
 */
export const createLocationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  geojson: geoJsonSchema, // Menerima standard GeoJSON object
});

/**
 * Data Transfer Object (DTO) untuk CreateLocation.
 * Dibuat otomatis dari skema Zod di atas.
 */
export class CreateLocationDto extends createZodDto(createLocationSchema) {}
