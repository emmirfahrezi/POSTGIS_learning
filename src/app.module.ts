import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

/**
 * Modul Akar (Root Module) dari aplikasi StrukturNest.
 * Berfungsi untuk mengumpulkan dan mendaftarkan semua sub-modul (User, Location, Prisma) 
 * agar dikenali oleh sistem NestJS saat aplikasi dijalankan.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule, 
    PrismaModule, 
    LocationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
