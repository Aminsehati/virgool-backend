import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class sendOtpEmailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string
}