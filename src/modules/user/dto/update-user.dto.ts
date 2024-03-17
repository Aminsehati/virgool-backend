import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { UserStatus } from "../types/user.type";

export class UpdateUserByAdminDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsMobilePhone('fa-IR')
    mobile?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ enum: UserStatus, required: false })
    @IsOptional()
    @IsEnum(UserStatus)
    status: UserStatus

}