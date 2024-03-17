import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { PaginationDto } from "src/lib/dto/pagination.dto";
import { CreateUserByAdminDto } from "./dto/create-user.dto";
import { UserStatus } from "./types/user.type";
import { UpdateUserByAdminDto } from "./dto/update-user.dto";
import { ProfileUserDto } from "./dto/profile-user.dto";
import { Profile } from "./entity/profile.entity";
import { sendOtpMobileDto } from "./dto/send-otp-mobile.dto";
import { OtpService } from "src/common/services/otp.service";
import { HashService } from "src/common/services/hash.service";
import { VerifyOtpDto } from "../auth/dto/verify-otp.dto";
import { VerifyOtpMobileDto } from "./dto/verify-otp-mobile.dto";
import { sendOtpEmailDto } from "./dto/send-otp-email.dto";
import { VerifyOtpEmailDto } from "./dto/verify-otp-email.dto";
import { UpdateUsernameDto } from "./dto/update-username.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private readonly otpService: OtpService,
        private readonly hashService: HashService
    ) {

    }
    async getProfileUser(userId: number) {
        return await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['profile']
        })
    }

    async getUsersByAdmin(paginationDto: PaginationDto) {
        const { limit = 10, skip = 1 } = paginationDto
        const [items, count] = await this.userRepository.findAndCount({
            take: limit,
            skip: limit * (skip - 1)
        });
        return {
            items,
            pagination: {
                limit,
                skip,
                count,
                page: Math.ceil(count / limit)
            }
        }
    }
    async getUserByAdmin(id: number) {
        const user = await this.userRepository.findOneBy({
            id
        });
        if (!user) throw new NotFoundException()
        return user
    }

    async createUserByAdmin(dto: CreateUserByAdminDto) {
        const duplicateMobile = await this.userRepository.findOneBy({
            mobile: dto?.mobile
        });
        if (duplicateMobile && dto.mobile) throw new BadRequestException('موبایل قبلا ثبت شده است');
        const duplicateEmail = await this.userRepository.findOneBy({
            email: dto?.email
        });
        if (duplicateEmail && dto.email) throw new BadRequestException('ایمیل قبلا ثبت شده است');
        const duplicateUsername = await this.userRepository.findOneBy({
            username: dto?.username
        });
        if (duplicateUsername && dto.username) throw new BadRequestException('نام کاربری قبلا ثبت شده است')
        return await this.userRepository.save({
            ...dto,
            status: UserStatus.CONFIRMED
        })

    }
    async deleteUserByAdmin(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException()
        await this.userRepository.delete({ id })
        return await this.userRepository.find()
    }
    async updateUserByAdmin(id: number, dto: UpdateUserByAdminDto) {
        const user = await this.userRepository.findOneBy({ id });
        const { status, email, mobile, username } = dto
        if (!user) throw new NotFoundException()
        const duplicateMobile = await this.userRepository.findOneBy({
            mobile
        });
        if (duplicateMobile && dto.mobile) throw new BadRequestException('موبایل قبلا ثبت شده است');
        const duplicateEmail = await this.userRepository.findOneBy({
            email
        });
        if (duplicateEmail && dto.email) throw new BadRequestException('ایمیل قبلا ثبت شده است');
        const duplicateUsername = await this.userRepository.findOneBy({
            username
        });
        if (duplicateUsername && dto.username) throw new BadRequestException('نام کاربری قبلا ثبت شده است');
        await this.userRepository.update({ id }, {
            ...(email && {
                email
            }),
            ...(mobile && {
                mobile
            }),
            ...(username && {
                username
            }),
            ...(status && {
                status
            })
        })
        return await this.userRepository.findOneBy({ id })
    }
    async updateProfileUser(userId: number, dto: ProfileUserDto) {
        const { bio, birthday, gender, linkedinProfile, nickName, xProfile } = dto
        const user = await this.userRepository.findOne({
            where: {
                id: userId
            }
        });
        console.log({ user })
        const profile = await this.profileRepository.findOneBy({
            userId
        });
        const data = {
            ...(bio && {
                bio
            }),
            ...(birthday && {
                birthDay: new Date(birthday)
            }),
            ...(gender && {
                gender
            }),
            ...(linkedinProfile && {
                linkedinProfile
            }),
            ...(nickName && {
                nickName
            }),
            ...(xProfile && {
                xProfile
            })
        }
        if (!profile) {
            await this.profileRepository.save({
                ...data,
                user
            })
        } else {
            await this.profileRepository.update({ id: profile.id }, { ...data })
        }
        return await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['profile']
        })
    }

    async sendOtpMobile(dto: sendOtpMobileDto) {
        const { mobile } = dto;
        const otp = await this.otpService.randomCode(4);
        const hashOtp = await this.hashService.hashString(otp);
        const hashMobile = await this.hashService.hashString(mobile);
        const sign = `${hashMobile}_${hashOtp}`
        return {
            otp,
            sign
        }
    }

    async verifyOtpMobile(userId: number, dto: VerifyOtpMobileDto, otp_mobile: string) {
        const { code, mobile } = dto
        const [hashMobile, hashOtp] = otp_mobile
        const verifyMobile = await this.hashService.verifyHash(mobile, hashMobile);
        const verifyOtp = await this.hashService.verifyHash(code, hashOtp);
        if (!verifyMobile || !verifyOtp) throw new BadRequestException('کد یکبارمصرف صحیح نمبایشد')
        await this.userRepository.update({ id: userId }, {
            mobile
        })
        return await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['profile']
        })
    }

    async sendOtpEmail(dto: sendOtpEmailDto) {
        const { email } = dto;
        const otp = await this.otpService.randomCode(4);
        const hashOtp = await this.hashService.hashString(otp);
        const hashEmail = await this.hashService.hashString(email);
        const sign = `${hashEmail}_${hashOtp}`
        return {
            otp,
            sign
        }

    }

    async verifyOtpEmail(userId: number, dto: VerifyOtpEmailDto, otp_email: string) {
        const { email, code } = dto
        const [hashEmail, hashOtp] = otp_email.split('_')
        const verifyEmail = await this.hashService.verifyHash(email, hashEmail);
        const verifyOtp = await this.hashService.verifyHash(code, hashOtp);
        if (!verifyEmail || !verifyOtp) throw new BadRequestException('کد یکبارمصرف صحیح نمبایشد')
        await this.userRepository.update({ id: userId }, {
            email
        })
        return await this.userRepository.findOne({
            where: {
                id: userId
            },
        })
    }

    async updateUsername(userId: number, dto: UpdateUsernameDto) {
        const { username } = dto
        await this.userRepository.update({ id: userId }, {
            username
        })
    }
}