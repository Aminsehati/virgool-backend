import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserByAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsMobilePhone('fa-IR')
    mobile: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    username: string
}