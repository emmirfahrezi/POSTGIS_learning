import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Cetak Biru (Blueprint) wajib untuk semua balasan (response) dari API kita.
 * Dengan interface ini, kita memaksa agar semua data API dibungkus rapi 
 * menggunakan format `{ statusCode, message, data }`.
 * 
 * @template T - Tipe data generik (bisa berisi tipe data apapun sesuai hasil dari Controller)
 */
export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // Jika response dari controller sudah memiliki format tertentu, kita bisa menyesuaikan
        const message = data?.message || 'Success';
        const resultData = data?.message ? data.data : data;

        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message,
          data: resultData || null,
        };
      }),
    );
  }
}
