import { HttpException, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { PayloadDTO } from './dtos/payload.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {

    constructor(
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
    ) { }

    async login(loginDto: LoginDto): Promise<PayloadDTO> {
        const correctPassword = await this._usersService.comparePassword(loginDto.email, loginDto.password);

        if (correctPassword) {
            try {

                const user = await this._usersService.findOne({ email: loginDto.email });
                const { password, deleted_at, ...payload } = user;
                const token = this._jwtService.sign(payload);
                return { token };
            } catch (err) {

                this.logger.log(err.message, "AuthService");
                throw new InternalServerErrorException();
            }
        } else {
            throw new HttpException('Incorrect email or password', 400);
        }
    }
}
