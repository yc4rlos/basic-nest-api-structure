import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { UserDto } from './dto/user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) { }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: 200, description: 'User Created With success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid data.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this._usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Users getted with success.', type: [UserDto] })
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this._usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'User getted with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided invalid ID' })
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this._usersService.findOne(+id);
  }

  @Patch('/restore/:id')
  @ApiResponse({ status: 200, description: 'User restored with success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  restore(@Param('id', ParseIntPipe) id: string) {
    return this._usersService.restore(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated with success.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Provided Invalid data or ID' })
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this._usersService.update(+id, updateUserDto);
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
    return this._usersService.resetPassword(token, data.password);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted with Success.' })
  @ApiResponse({ status: 400, description: 'Provided invalid ID.' })
  remove(@Param('id', ParseIntPipe) id: string) {
    return this._usersService.remove(+id);
  }
}
