import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UsersService {

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _mailService: MailService
  ) { }

  public async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try{
      const user = this._userRepository.create(createUserDto);
      const resp = await this._userRepository.save(user);
      return new UserDto(resp);

    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async findAll(): Promise<UserDto[]> {
    try{
      const users = await this._userRepository.find();
      let resp = [];
      users.forEach(user => resp.push(new UserDto(user)));
      return resp;

    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async findOne(param: unknown): Promise<UserDto> {
    try{
      const resp = await this._userRepository.findOne({ where: param });
      return new UserDto(resp);

    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
  try{
    const { password, ...user } = updateUserDto
    await this._userRepository.update(id, user);
    return this.findOne({ id });

  }catch(err){
  this.logger.log(err.message, "UsersService")
  throw new InternalServerErrorException();

  }
  }

  public async remove(id: number): Promise<any> {
    try{
      return await this._userRepository.softDelete(id);

    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async restore(id: number): Promise<any> {
    try{
      return await this._userRepository.restore(id);

    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async comparePassword(email: string, password: string): Promise<boolean> {
    try{

      const user = await this._userRepository.findOne({ where: { email } });
      if (user) {
        return await bcrypt.compare(password, user.password);
      } else {
        return false;
      }
    }catch(err){
      this.logger.log(err.message, "UsersService")
      throw new InternalServerErrorException();
    }
  }

  public async recoverPassword(email: string) {
    const user = await this._userRepository.findOne({ where: { email } })
    if (user) {
      try {
        const token = shortid.generate();
        await this._mailService.passwordRecover(email, token);
        await this._userRepository.update({ email }, { recoverToken: token });
        return { status: 'Email sent.' }

      } catch (err) {

        this.logger.error(err.message, "UsersService");
        throw new InternalServerErrorException();
      }
    } else {
      throw new HttpException('User not finded', 400);
    }
  }

  public async resetPassword(token, password: string) {
    const user = await this._userRepository.findOne({ where: { recoverToken: token } });
    if (user) {
      try {
        user.password = password;
        return this._userRepository.update({ recoverToken: token }, user);

      } catch (err) {
        
        this.logger.error(err.message, "UsersService");
        throw new InternalServerErrorException();
      }
    } else {
      throw new HttpException('Invalid token', 400);
    }
  }
}
