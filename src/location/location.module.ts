import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';
import { LocationController } from './location.controller';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}
