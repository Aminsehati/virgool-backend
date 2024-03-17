import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { report } from "process";
import { PaginationDto } from "src/lib/dto/pagination.dto";
import { SwaggerConsumes } from "src/lib/types/swagger";
import { CategoryService } from "src/modules/category/category.service";
import { CreateCategoryDto } from "src/modules/category/dto/create-category.dto";
import { UpdateCategoryDto } from "src/modules/category/dto/update-category.dto";
import AdminTokenGuard from "../guards/access-token.guard";


@ApiBearerAuth('Admin-Access-Token')
@UseGuards(AdminTokenGuard)


@ApiTags('Admin/category')
@Controller('/admin/category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) {

    }
    @Post('/')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async createCategoryByAdmin(@Body() dto: CreateCategoryDto) {
        return await this.categoryService.createCategoryByAdmin(dto);
    }

    @Get('/')
    async getCategoriesByAdmin(@Query() paginationDto: PaginationDto) {
        return await this.categoryService.getCategoriesByAdmin(paginationDto)
    }

    @Get('/:id')
    async getCategoryByAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.categoryService.getCategoryByAdmin(id)
    }

    @Delete('/:id')
    async deleteCategoryByAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.categoryService.deleteCategoryByAdmin(id);
    }

    @Patch('/:id')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async updateCategoryByAdmin(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return await this.categoryService.updateCategoryByAdmin(id, dto)
    }
}