import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../common/services/prisma.service';

/**
 * UserService menangani semua logika bisnis (Business Logic) terkait entitas User.
 * Berinteraksi langsung dengan PrismaService untuk urusan tabel "User".
 */
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Menyimpan data pengguna baru ke database.
   * 
   * @param createUserDto - DTO yang berisi data pengguna baru
   */
  async create(createUserDto: CreateUserDto) {
    // Menyimpan data request langsung ke database!
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  /**
   * Mengambil semua daftar pengguna beserta data lokasinya.
   */
  async findAll() {
    return await this.prisma.user.findMany({
      include: { location: true }, // Sekalian menampilkan data lokasinya jika ada
    });
  }

  /**
   * Mengambil detail satu pengguna berdasarkan ID beserta data lokasinya.
   * 
   * @param id - ID pengguna
   */
  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { location: true },
    });
  }

  /**
   * Memperbarui data pengguna.
   * 
   * @param id - ID pengguna
   * @param updateUserDto - Data parsial yang ingin diperbarui
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Menghapus pengguna secara permanen dari database.
   * 
   * @param id - ID pengguna
   */
  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
