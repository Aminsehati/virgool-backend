import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/lib/dto/pagination.dto";
import { SwaggerConsumes } from "src/lib/types/swagger";
import { CreateUserByAdminDto } from "src/modules/user/dto/create-user.dto";
import { UpdateUserByAdminDto } from "src/modules/user/dto/update-user.dto";
import { UserService } from "src/modules/user/user.service";
import AdminTokenGuard from "../guards/access-token.guard";

@ApiBearerAuth('Admin-Access-Token')
@UseGuards(AdminTokenGuard)



@ApiTags('Admin/user')
@Controller('/admin/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {

    }
    @Get('/')
    async getUsersByAdmin(@Query() query: PaginationDto) {
        return await this.userService.getUsersByAdmin(query)
    }

    @Get('/:id')
    async getUserByAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.getUserByAdmin(id)
    }

    @Post('/')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async createUserByAdmin(@Body() body: CreateUserByAdminDto) {
        return await this.userService.createUserByAdmin(body);
    }

    @Delete('/:id')
    async deleteUserByAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.deleteUserByAdmin(id);
    }

    @Patch('/:id')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async updateUserByAdmin(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserByAdminDto) {
        return await this.userService.updateUserByAdmin(id, dto)
    }
}