import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Skema validasi Zod untuk pembuatan User baru.
 * Berfungsi memastikan data email, nama, dan password memenuhi syarat minimal
 * sebelum diizinkan masuk ke Controller.
 */
export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

/**
 * Data Transfer Object (DTO) untuk CreateUser.
 * Dibuat secara otomatis dengan menerjemahkan skema Zod di atas menjadi Class TypeScript.
 */
export class CreateUserDto extends createZodDto(createUserSchema) {}
