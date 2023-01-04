import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as shortid from 'shortid';
import { HttpException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _mailService: MailService
  ) { }

  public async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this._userRepository.create(createUserDto);
    const resp = await this._userRepository.save(user);
    return new UserDto(resp);
  }

  public async findAll(): Promise<UserDto[]> {
    const users = await this._userRepository.find();
    let resp = [];
    users.forEach(user => resp.push(new UserDto(user)));
    return resp;
  }

  public async findOne(param: unknown): Promise<UserDto> {

    const resp = await this._userRepository.findOne({ where: param });
    return new UserDto(resp);
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {

    const { password, ...user } = updateUserDto
    await this._userRepository.update(id, user);
    const resp = await this._userRepository.findOne({ where: { id } });

    return new UserDto(resp);
  }

  public remove(id: number): Promise<any> {
    return this._userRepository.softDelete(id);
  }

  public restore(id: number): Promise<any> {
    return this._userRepository.restore(id);
  }

  public async comparePassword(email: string, password: string): Promise<boolean> {
    const user = await this._userRepository.findOne({ where: { email } });
    if (user) {
      return await bcrypt.compare(password, user.password);
    } else {
      return false;
    }
  }

  public async recoverPassword(email: string) {
    const user = await this._userRepository.findOne({ where: { email } })
    if (user) {
      const token = shortid.generate();
      await this._mailService.passwordRecover(email, token);
      await this._userRepository.update({ email }, { recoverToken: token });
      return { status: 'Email sent.' }
    } else {
      throw new HttpException('User not finded', 400);
    }
  }

  public async resetPassword(token, password: string) {
    const user = await this._userRepository.findOne({ where: { recoverToken: token } });
    if (user) {
      user.password = password;
      return this._userRepository.update({ recoverToken: token }, user);
    } else {
      throw new HttpException('Invalid token', 400);
    }
  }
}
