import { Body, Controller, Inject, Post } from "@nestjs/common/decorators";
import { LoginDto } from "./dtos/login.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PayloadDTO } from "./dtos/payload.dto";
import { AuthService } from "./auth.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "typeorm";
import { InternalServerErrorException } from "@nestjs/common";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {

    constructor(
        private readonly _authService: AuthService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
        ) { }

    @Post('/login')
    @ApiResponse({ status: 200, description: 'User getted with success.', type: PayloadDTO })
    @ApiResponse({ status: 400, description: "Can't log in, invalid password or email" })
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this._authService.login(loginDto)

        }catch(err){
            this.logger.log(err.message, AuthController.name);
            throw new InternalServerErrorException();
        }
    }
}