import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignupDto } from "../dto/signup.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "../entity/admin.entity";
import { HashService } from "src/common/services/hash.service";
import { AdminStatus } from "../types/admin.type";
import { ConfigService } from "@nestjs/config";
import { LoginAdminDto } from "../dto/login-admin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        private readonly hashService: HashService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {

    }
    async signupAdmin(body: SignupDto) {
        const admin = await this.adminRepository.findOneBy({});
        if (admin) return
        const password = await this.hashService.hashString(body.password);
        return await this.adminRepository.save({
            ...body,
            password,
            status: AdminStatus.CONFIRMED,
        })
    }

    async loginAdmin(body: LoginAdminDto) {
        const admin = await this.adminRepository.findOneBy({
            username: body?.username
        });
        if (!admin) throw new UnauthorizedException('نام کاربری یا رمزعبور صحیح نمیباشد');
        const isVerified = await this.hashService.verifyHash(body.password, admin.password);
        if (!isVerified) throw new UnauthorizedException('نام کاربری یا رمزعبور صحیح نمیباشد')
        const access_token = await this.jwtService.sign({
            id: admin.id,
            mobile: admin.mobile
        }, {
            secret: this.configService.get<string>('ADMIN_JWT_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_ADMIN_EXPIRATION'),

        });

        const refresh_token = await this.jwtService.sign({
            id: admin.id,
            mobile: admin.mobile
        }, {
            secret: this.configService.get<string>('ADMIN_JWT_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_ADMIN_EXPIRATION'),
        });

        return {
            access_token,
            refresh_token,
            admin
        }
    }
}