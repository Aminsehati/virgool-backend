import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    username: string


    @ApiProperty()
    @IsNotEmpty()
    password: string
}