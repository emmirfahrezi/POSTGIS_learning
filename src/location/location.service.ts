import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { CreateLocationDto } from './dto/create-location.dto';

/**
 * LocationService mengatur alur bisnis logika untuk fungsionalitas geospasial.
 * Karena kita menggunakan pola Clean Architecture (Repository Pattern), 
 * Service ini menjadi sangat bersih karena semua operasi database ditangani oleh LocationRepository.
 */
@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Memproses dan menyimpan data lokasi spasial milik pengguna.
   * Akan langsung mengambil data terbarunya setelah berhasil disimpan.
   * 
   * @param userId - ID pengguna
   * @param createLocationDto - Data lokasi beserta GeoJSON
   */
  async createOrUpdate(userId: number, createLocationDto: CreateLocationDto) {
    await this.locationRepository.saveLocation(userId, createLocationDto);
    return this.getUserLocation(userId);
  }

  /**
   * Mengambil data lokasi milik pengguna.
   * 
   * @param userId - ID pengguna
   */
  async getUserLocation(userId: number) {
    return this.locationRepository.getLocationByUserId(userId);
  }

  /**
   * Memproses pencarian titik radius di sekitar titik tertentu.
   * 
   * @param longitude - Garis bujur pusat pencarian
   * @param latitude - Garis lintang pusat pencarian
   * @param radiusInMeters - Jarak radius maksimum dalam meter
   */
  async findUsersNearby(longitude: number, latitude: number, radiusInMeters: number) {
    return this.locationRepository.findNearbyUsers(longitude, latitude, radiusInMeters);
  }
}
