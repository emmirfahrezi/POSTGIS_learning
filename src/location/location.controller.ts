import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

/**
 * LocationController menangani semua rute (endpoints) HTTP yang berawalan `/api/location`.
 * Bertugas mengelola integrasi data geospasial (Peta) dari request Frontend ke Backend.
 */
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * Endpoint untuk menyimpan atau memperbarui data lokasi spasial pengguna (Upsert).
   * Method: POST /api/location/:userId
   * 
   * @param userId - ID unik pengguna
   * @param createLocationDto - Data lokasi yang berisi nama, alamat, dan objek GeoJSON
   */
  @Post(':userId')
  async createOrUpdate(
    @Param('userId') userId: string,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return await this.locationService.createOrUpdate(+userId, createLocationDto);
  }

  /**
   * Endpoint untuk mengambil data lokasi pengguna tertentu dalam format GeoJSON.
   * Method: GET /api/location/:userId
   * 
   * @param userId - ID unik pengguna
   */
  @Get(':userId')
  async getUserLocation(@Param('userId') userId: string) {
    return await this.locationService.getUserLocation(+userId);
  }

  /**
   * Endpoint untuk mencari pengguna di sekitar koordinat tertentu (Nearby Search).
   * Method: GET /api/location/nearby/search
   * 
   * @param longitude - Garis bujur titik pusat (contoh: 106.82)
   * @param latitude - Garis lintang titik pusat (contoh: -6.17)
   * @param radiusInMeters - Maksimal jarak pencarian dalam meter (default: 5000)
   */
  @Get('nearby/search')
  async findNearby(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
    @Query('radius') radiusInMeters: string = '5000',
  ) {
    return await this.locationService.findUsersNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseFloat(radiusInMeters),
    );
  }
}
