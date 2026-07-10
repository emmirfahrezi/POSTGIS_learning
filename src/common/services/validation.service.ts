import { Injectable } from '@nestjs/common';
import { ZodValidationPipe as BaseZodValidationPipe } from 'nestjs-zod';

/**
 * ValidationService kustom yang dibungkus di dalam folder `common/services`.
 * Secara bawaan ia mewarisi semua sifat asli dari `nestjs-zod`.
 * 
 * Alasan kita membungkusnya di sini adalah agar di masa depan 
 * kita bisa dengan mudah memodifikasi logika validasi global 
 * tanpa harus mengotak-atik file `main.ts`.
 */
@Injectable()
export class ValidationService extends BaseZodValidationPipe {
  // Nantinya kamu bisa *override* fungsi tertentu di sini jika diperlukan
}
