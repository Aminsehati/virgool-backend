import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateUsernameDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(3, 100)
    username: string
}