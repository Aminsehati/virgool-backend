import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";
import { Category } from "./entity/category.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
    imports: [
        CommonModule,
        TypeOrmModule.forFeature([Category])
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService]
})

export class CategoryModule {

}