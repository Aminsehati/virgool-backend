import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { AuthType, AuthMethod } from "../types/auth.type";

export class VerifyOtpDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(4)
    code: string

    @ApiProperty({
        enum: AuthMethod,
        enumName: 'method'
    })
    @IsEnum(AuthMethod)
    method: AuthMethod

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    username: string
}