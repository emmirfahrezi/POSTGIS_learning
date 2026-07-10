import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ZodValidationPipe } from 'nestjs-zod';

/**
 * Fungsi utama untuk menjalankan (bootstrap) aplikasi NestJS.
 * Di sini kita mengatur semua konfigurasi global seperti prefix, 
 * filter error, interceptor response, pipa validasi, dan dokumentasi Swagger.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set prefix '/api' untuk semua route
  app.setGlobalPrefix('api');

  // Mengaktifkan interceptor format response secara global
  app.useGlobalInterceptors(new TransformInterceptor());

  // Mengaktifkan filter error global (menangkap error prisma, zod, dll)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Mengaktifkan Zod Validation Pipe secara global
  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('StrukturNest API')
    .setDescription('The API description for StrukturNest project')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
