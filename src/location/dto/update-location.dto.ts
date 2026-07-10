import { createZodDto } from 'nestjs-zod';
import { createLocationSchema } from './create-location.dto';

const updateLocationSchema = createLocationSchema.partial();

export class UpdateLocationDto extends createZodDto(updateLocationSchema) {}
