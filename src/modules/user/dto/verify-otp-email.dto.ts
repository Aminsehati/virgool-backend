import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class VerifyOtpEmailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    code: string
}