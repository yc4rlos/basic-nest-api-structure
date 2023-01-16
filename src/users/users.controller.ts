import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, UseGuards, Logger, Inject, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ) { }

  @Post()
  @ApiResponse({ status: 200, description: 'User Created With success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data.' })
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this._usersService.create(createUserDto);

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Users getted with success.', type: [UserDto] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    try {
      return await this._usersService.findAll();

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User getted with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this._usersService.findOne({ id: +id });

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Patch('/restore/:id')
  @ApiResponse({ status: 200, description: 'User restored with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async restore(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this._usersService.restore(+id);

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid data or ID' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this._usersService.update(+id, updateUserDto);

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted with Success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this._usersService.remove(+id);

    } catch (err) {

      this.logger.error(err.message, UsersController.name);
      throw new InternalServerErrorException();
    }
  }

  @Put('/recoverPassword')
  @ApiResponse({ status: 200, description: 'Email to recover sent.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid email.' })
  async recoverPassword(@Body() data: { email: string }) {
    return await this._usersService.recoverPassword(data.email);
  }

  @Put('/recoverPassword/:token')
  @ApiResponse({ status: 200, description: 'Password updated.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid token.' })
  async resetPassword(@Param('token') token: string, @Body() data: { password: string }) {
    return await this._usersService.resetPassword(token, data.password);
  }
}
