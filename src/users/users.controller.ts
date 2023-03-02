import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    
  ) { }

  @Post()
  @ApiResponse({ status: 200, description: 'User Created With success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data.' })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
      return  this._usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Users getted with success.', type: [UserDto] })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
      return this._usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User getted with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: string) {  
      return this._usersService.findOne({ id: +id });

  }

  @Patch('/restore/:id')
  @ApiResponse({ status: 200, description: 'User restored with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  restore(@Param('id', ParseIntPipe) id: string) {
      return this._usersService.restore(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid data or ID' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
      return  this._usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted with Success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: string) {  
      return this._usersService.remove(+id);

  }

  @Put('/recoverPassword')
  @ApiResponse({ status: 200, description: 'Email to recover sent.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid email.' })
  recoverPassword(@Body() data: { email: string }) {
    return this._usersService.recoverPassword(data.email);
  }

  @Put('/recoverPassword/:token')
  @ApiResponse({ status: 200, description: 'Password updated.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid token.' })
  resetPassword(@Param('token') token: string, @Body() data: { password: string }) {
    return  this._usersService.resetPassword(token, data.password);
  }
}
