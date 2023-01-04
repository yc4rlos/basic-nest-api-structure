import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { PayloadDTO } from './dtos/payload.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService
    ) { }

    async login(loginDto: LoginDto): Promise<PayloadDTO> {
        const correctPassword = await this._usersService.comparePassword(loginDto.email, loginDto.password);
        if (correctPassword) {
            const user = await this._usersService.findOne({ email: loginDto.email });
            const { password, deleted_at, ...payload } = user;
            const token = this._jwtService.sign(payload);
            return { token };
        } else {
            throw new HttpException('Incorrect email or password', 400);
        }
    }
}
