import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString, Length } from "class-validator";
import { AuthMethod, AuthType } from "../types/auth.type";

export class AuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    username: string

    @ApiProperty({
        enum: AuthType,
        enumName: 'type'
    })
    @IsEnum(AuthType)
    type: AuthType

    @ApiProperty({
        enum: AuthMethod,
        enumName: 'method'
    })
    @IsEnum(AuthMethod)
    method: AuthMethod
}