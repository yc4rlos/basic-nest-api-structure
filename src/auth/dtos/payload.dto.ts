import { ApiProperty } from "@nestjs/swagger";

export class PayloadDTO {

    @ApiProperty({description: 'JWT Bearer Token'})
    token: string;
}