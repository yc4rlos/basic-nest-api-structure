import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {

    @ApiProperty({description: 'User Email address'})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({description: 'User password'})
    @IsNotEmpty()
    password: string;
}