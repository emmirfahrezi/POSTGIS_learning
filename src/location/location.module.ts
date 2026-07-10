import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationController } from './location.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}
