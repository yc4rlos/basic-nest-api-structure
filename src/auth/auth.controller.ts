import { Body, Controller, Post } from "@nestjs/common/decorators";
import { LoginDto } from "./dtos/login.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PayloadDTO } from "./dtos/payload.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {

    constructor(private readonly _authService: AuthService) { }

    @Post('/login')
    @ApiResponse({ status: 200, description: 'User getted with success.', type: PayloadDTO })
    @ApiResponse({ status: 400, description: "Can't log in, invalid password or email" })
    login(@Body() loginDto: LoginDto) {
        return this._authService.login(loginDto)
    }
}