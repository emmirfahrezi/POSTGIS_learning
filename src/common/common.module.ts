import { Module, Global } from '@nestjs/common';
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationService } from './services/validation.service';
import { PrismaService } from './services/prisma.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

/**
 * CommonModule membungkus semua provider global seperti PrismaService, Pipa Validasi,
 * Filter Error, dan Interceptor agar struktur proyek menjadi sangat rapi.
 * Modul ini di-import satu kali di `AppModule` dan berlaku global.
 */
@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationService,
    },
  ],
  exports: [PrismaService], // PrismaService otomatis dikenali di module mana pun
})
export class CommonModule {}
