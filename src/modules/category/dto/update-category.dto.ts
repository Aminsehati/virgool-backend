import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CategoryStatus } from '../types/category.type';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    slug: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    priority: number;

    @ApiProperty({ enum: CategoryStatus, required: false })
    @IsOptional()
    @IsEnum(CategoryStatus)
    status: CategoryStatus
}