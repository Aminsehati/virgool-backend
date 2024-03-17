import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    limit: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    skip: number
}