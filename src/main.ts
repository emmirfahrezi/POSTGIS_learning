import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


/**
 * Fungsi utama untuk menjalankan (bootstrap) aplikasi NestJS.
 * Di sini kita mengatur semua konfigurasi global seperti prefix, 
 * filter error, interceptor response, pipa validasi, dan dokumentasi Swagger.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set prefix '/api' untuk semua route
  app.setGlobalPrefix('api');

  // Catatan: Interceptor, Filter, dan Zod Pipe sekarang diurus oleh CommonModule
  // agar file main.ts ini menjadi sangat rapi dan bersih.

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
