import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entity/category.entity";
import { Repository } from "typeorm";
import { PublicService } from "src/common/services/public.service";
import { CategoryStatus } from "./types/category.type";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PaginationDto } from "src/lib/dto/pagination.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        private readonly publicService: PublicService
    ) {

    }
    async createCategoryByAdmin(dto: CreateCategoryDto) {
        const { name, priority, slug } = dto
        const duplicateName = await this.categoryRepository.findOneBy({
            name: dto?.name
        });
        if (duplicateName && dto.name) throw new BadRequestException('نام وارد شده تکراری میباشد')
        const generateSlug = await this.publicService.generateSlug(name);
        return await this.categoryRepository.save({
            name,
            slug: slug ? slug : generateSlug,
            ...(priority && {
                priority
            }),
            status: CategoryStatus.CONFIRMED
        })
    }

    async getCategoriesByAdmin(paginationDto: PaginationDto) {
        const { limit = 10, skip = 1 } = paginationDto
        const [items, count] = await this.categoryRepository.findAndCount({
            take: limit,
            skip: (limit) * (skip - 1)
        });
        return {
            items,
            pagination: {
                count,
                limit,
                skip,
                page:Math.ceil(count / limit)
            }
        }
    }

    async getCategoryByAdmin(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) throw new NotFoundException()
        return category
    }

    async deleteCategoryByAdmin(id: number) {
        const category = await this.categoryRepository.findOneBy({ id })
        if (!category) throw new NotFoundException()
        return await this.categoryRepository.delete({ id })
    }

    async updateCategoryByAdmin(id: number, dto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) throw new NotFoundException()
        const { name, priority, slug, status } = dto
        const duplicateName = await this.categoryRepository.findOneBy({
            name: dto?.name
        });
        if (duplicateName && dto.name) throw new BadRequestException('نام وارد شده تکراری میباشد')
        const generateSlug = await this.publicService.generateSlug(name);
        await this.categoryRepository.update({ id }, {
            ...(name && {
                name
            }),
            ...(priority && {
                priority
            }),
            ...(status && {
                status
            }),
            slug: slug ? slug : generateSlug

        })
    }
}