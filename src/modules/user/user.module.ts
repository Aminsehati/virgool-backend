import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Profile } from "./entity/profile.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CommonModule } from "src/common/common.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        CommonModule
    ],
    controllers: [UserController],
    exports: [UserService],
    providers: [UserService]
})
export class UserModule {

}