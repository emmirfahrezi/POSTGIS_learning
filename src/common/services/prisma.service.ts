import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * PrismaService menangani koneksi database menggunakan Prisma ORM.
 * Menggunakan `PrismaPg` adapter untuk menghubungkan Prisma secara efisien
 * dengan driver `pg` asli PostgreSQL.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Menginisialisasi koneksi *pool* ke PostgreSQL menggunakan string koneksi.
   */
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  /**
   * Dipanggil otomatis oleh NestJS sesaat sebelum aplikasi sepenuhnya berjalan
   * untuk memastikan koneksi database sudah stabil.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
