import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';

/**
 * GlobalExceptionFilter menangkap semua *Error* yang terjadi di seluruh aplikasi
 * agar tidak sampai menyebabkan server mati (crash). Filter ini akan membungkus 
 * error tersebut menjadi JSON yang seragam untuk dikembalikan ke Frontend.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Menangani setiap *exception* (error) yang dilempar dari sembarang tempat.
   * 
   * @param exception - Objek error yang tertangkap (bisa error Zod, Prisma, atau sistem)
   * @param host - Objek yang berisi konteks request/response HTTP
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || exception.message;
      errorDetails = res.error || null;
    } 
    // Menangani error validasi Zod
    else if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      const zodError = exception.getZodError() as any;
      errorDetails = zodError.errors.map((e: any) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
    }
    // Menangani error Prisma (Database)
    else if (exception?.name === 'PrismaClientKnownRequestError') {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Data conflict';
        errorDetails = `Unique constraint failed (Duplicate data): ${exception.meta?.target}`;
      } else if (exception.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference';
        errorDetails = `Foreign key constraint failed. Related data does not exist.`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Data not found';
        errorDetails = exception.meta?.cause || exception.message;
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Database request error';
        errorDetails = exception.message;
      }
    } else {
      // Log unhandled errors ke terminal untuk debugging internal
      console.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: errorDetails,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
