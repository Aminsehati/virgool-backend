import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "src/common/common.module";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Admin } from "./entity/admin.entity";
import { JwtModule } from "@nestjs/jwt";
import AdminTokenGuard from "./guards/access-token.guard";
import { AdminTokenStrategy } from "./guards/access-token.strategy";
import { CategoryController } from "./controllers/category.controller";
import { CategoryModule } from "../category/category.module";
import { UserModule } from "../user/user.module";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        CommonModule,
        TypeOrmModule.forFeature([Admin]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('ADMIN_JWT_SECRET'),
                signOptions: {},
            }),
            inject: [ConfigService],
        }),
        UserModule,
        CategoryModule
    ],
    controllers: [
        AuthController,
        UserController,
        CategoryController
    ],
    providers: [
        AuthService,
        AdminTokenGuard,
        AdminTokenStrategy
    ],
    exports: [
        AuthService,
        AdminTokenGuard,
        AdminTokenStrategy
    ]
})
export class AdminModule {

}