import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UserController menangani semua rute (endpoints) HTTP yang berawalan `/api/user`.
 * Bertugas menerima *request* dari Frontend dan meneruskannya ke UserService.
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint untuk membuat pengguna baru.
   * Method: POST /api/user
   * 
   * @param createUserDto - Data user baru (divalidasi otomatis oleh Zod)
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Endpoint untuk mengambil semua daftar pengguna.
   * Method: GET /api/user
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Endpoint untuk mengambil data satu pengguna berdasarkan ID.
   * Method: GET /api/user/:id
   * 
   * @param id - ID pengguna
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * Endpoint untuk memperbarui data pengguna.
   * Method: PATCH /api/user/:id
   * 
   * @param id - ID pengguna
   * @param updateUserDto - Data parsial yang ingin diupdate
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * Endpoint untuk menghapus pengguna.
   * Method: DELETE /api/user/:id
   * 
   * @param id - ID pengguna
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
