import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";

export class UserDto {
    @ApiProperty({ description: 'User Id' })
    id: number;

    @Exclude()
    password: string;

    @Exclude()
    recoverToken: string;

    @ApiProperty({ description: 'User Dreated Date' })
    created_at: Date;

    @ApiProperty({ description: 'User Updated Date' })
    updated_at: Date;

    @ApiProperty({ description: 'User Deleted Date', nullable: true })
    deleted_at?: Date;

    constructor(partial: Partial<CreateUserDto>) {
        Object.assign(this, partial);
    }
}