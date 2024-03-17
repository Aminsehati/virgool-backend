import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { CommonModule } from "src/common/common.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import UserTokenGuard from "./guards/access-token.guard";
import { UserTokenStrategy } from "./guards/access-token.strategy";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        CommonModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('USER_JWT_SECRET'),
                signOptions: {},
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserTokenGuard, UserTokenStrategy],
    exports: [AuthService, UserTokenGuard, UserTokenStrategy]
})
export class AuthModule {

}