import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator"
import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {

    @ApiProperty({description: 'User Name'})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({description: 'User Email'})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({description: 'User Password'})
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
