import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug: string

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    priority: number
}