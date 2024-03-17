import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthMethod, AuthType } from "./types/auth.type";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entity/user.entity";
import { isEmail, isMobilePhone, isPhoneNumber } from "class-validator";
import { OtpService } from "src/common/services/otp.service";
import { Response } from 'express'
import { HashService } from "src/common/services/hash.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { UserStatus } from "../user/types/user.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly otpService: OtpService,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {

    }
    async userExistence(authDto: AuthDto) {
        const { method, type, username } = authDto
        switch (type) {
            case AuthType.REGISTER:
                return await this.registerUser(method, username)
            case AuthType.LOGIN:
                return await this.loginUser(method, username)
            default:
                throw new UnauthorizedException()
        }

    }

    async loginUser(method: AuthMethod, username: string) {
        const validateUsername = await this.usernameValidation(method, username);
        const user = await this.userRepository.findOneBy({
            [method]: validateUsername
        });
        if (!user) throw new UnauthorizedException()
        const { otp, sign } = await this.sendOtp(method, username);
        return {
            otp,
            sign
        }
    }

    async registerUser(method: AuthMethod, username: string) {
        const validateUsername = await this.usernameValidation(method, username);
        if (username === AuthMethod.USERNAME) throw new BadRequestException();
        const user = await this.userRepository.findOneBy({
            [method]: validateUsername
        });
        if (user) throw new BadRequestException('user is exist');
        const { otp, sign } = await this.sendOtp(method, username);
        return {
            otp,
            sign
        }


    }

    async usernameValidation(method: AuthMethod, username: string) {
        switch (method) {
            case AuthMethod.EMAIL:
                if (!isEmail(username)) throw new BadRequestException('email is inCorrect')
                return username
            case AuthMethod.MOBILE:
                if (!isMobilePhone(username, 'fa-IR')) throw new BadRequestException('mobile is inCorrect')
                return username

            case AuthMethod.USERNAME:

            default:
                throw new UnauthorizedException()
        }
    }
    async sendOtp(method: AuthMethod, username: string) {
        if (method === AuthMethod.EMAIL || method === AuthMethod.USERNAME) {
            return await this.sendOtpWithEmail(method, username)
        } else if (method === AuthMethod.MOBILE) {
            return await this.sendOtpWithEmail(method, username)
        }
    }

    async sendOtpWithEmail(method: AuthMethod, username: string) {
        return await this.generateOtp(method, username)
    }

    async sendOtpWithMobile(method: AuthMethod, username: string) {
        return await this.generateOtp(method, username)
    }
    async generateOtp(method: AuthMethod, username: string) {
        const otp = await this.otpService.randomCode(4);
        const hashOtp = await this.hashService.hashString(otp);
        const hashUsername = await this.hashService.hashString(username);
        const hashMethod = await this.hashService.hashString(method);
        const sign = `${hashOtp}_${hashMethod}_${hashUsername}`
        return {
            otp,
            sign
        }
    }

    async verifyOtp(body: VerifyOtpDto, otp_sign: string) {
        const [hashOtp, hashMethod, hashUsername] = otp_sign.split("_");
        const verifyOtp = await this.hashService.verifyHash(body.code, hashOtp);
        const verifyMethod = await this.hashService.verifyHash(body.method, hashMethod);
        const verifyUsername = await this.hashService.verifyHash(body.username, hashUsername);
        if (!verifyOtp || !verifyMethod || !verifyUsername) throw new BadRequestException('کد یکبارمصرف صحیح نمیباشد');
        let user = await this.userRepository.findOneBy({
            [body.method]: body.username
        });
        if (!user) {
            user = await this.userRepository.save({
                status: UserStatus.CONFIRMED,
                [body.method]: body.username
            })
        }
        const access_token = await this.jwtService.sign({ id: user.id, [body.method]: body.username }, {
            secret: this.configService.get<string>('USER_JWT_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_USER_EXPIRATION')
        })

        const refresh_token = await this.jwtService.sign({ id: user.id, [body.method]: body.username }, {
            secret: this.configService.get<string>('USER_JWT_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_USER_EXPIRATION')
        })
        return {
            access_token,
            refresh_token,
            user
        }
    }
}