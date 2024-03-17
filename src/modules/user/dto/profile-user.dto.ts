import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "../types/user.type";

export class ProfileUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nickName: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    linkedinProfile: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    xProfile: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(5,200)
    bio: string

    @ApiProperty({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender: Gender

    @ApiProperty()
    @IsOptional()
    @IsDate()
    birthday: Date;
}