import { BadRequestException, Body, Controller, Get, Patch, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import UserTokenGuard from "../auth/guards/access-token.guard";
import { GetUser } from "src/lib/decorators/get-user";
import { ITokenPayloadUser } from "src/lib/types/token.interface";
import { UserService } from "./user.service";
import { ProfileUserDto } from "./dto/profile-user.dto";
import { sendOtpMobileDto } from "./dto/send-otp-mobile.dto";
import { Cookies } from "src/lib/decorators/cookies.decorator";
import { Response } from 'express'
import { VerifyOtpMobileDto } from "./dto/verify-otp-mobile.dto";
import { sendOtpEmailDto } from "./dto/send-otp-email.dto";
import { VerifyOtpEmailDto } from "./dto/verify-otp-email.dto";
import { UpdateUsernameDto } from "./dto/update-username.dto";


@ApiBearerAuth('access-token')
@UseGuards(UserTokenGuard)

@Controller('/user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {

    }
    @Get('/profile')
    async getProfileUser(@GetUser() user: ITokenPayloadUser) {
        return await this.userService.getProfileUser(user.id)
    }

    @Patch('/profile')
    async updateProfileUser(@Body() dto: ProfileUserDto, @GetUser() user: ITokenPayloadUser) {
        return await this.userService.updateProfileUser(user.id, dto);
    }

    @Post('/mobile/send-otp')
    async sendOtpMobile(@Body() dto: sendOtpMobileDto, @Res() res: Response, @Cookies('otp_mobile') otp_mobile: string) {
        const { otp, sign } = await this.userService.sendOtpMobile(dto);
        if (otp_mobile) throw new BadRequestException('کد یکبار مصرف قبلا استفاده شده است');
        res.cookie('otp_mobile', sign, {
            httpOnly: true,
            maxAge: 12e4,
        })
        return res.status(200).json({
            sucess: true,
            data: {
                otp
            }
        })
    }

    @Post('/mobile/verify-otp')
    async verifyOtpMobile(@Body() dto: VerifyOtpMobileDto, @Cookies('otp_mobile') otp_mobile: string, @GetUser() user: ITokenPayloadUser) {
        if (!otp_mobile) throw new BadRequestException();
        return await this.userService.verifyOtpMobile(user.id, dto, otp_mobile)
    }

    @Post('/email/send-otp')
    async sendOtpEmail(@Body() dto: sendOtpEmailDto, @Cookies('otp_email') otp_email: string, @Res() res: Response) {
        const { otp, sign } = await this.userService.sendOtpEmail(dto);
        if (otp_email) throw new BadRequestException('کد یکبار مصرف قبلا استفاده شده است');
        res.cookie('otp_email', sign, {
            httpOnly: true,
            maxAge: 12e4,
        })
        return res.status(200).json({
            sucess: true,
            data: {
                otp
            }
        })
    }

    @Post('/email/verify-otp')
    async verifyOtpEmail(@Cookies('otp_email') otp_email: string, @Body() dto: VerifyOtpEmailDto, @GetUser() user: ITokenPayloadUser) {
        if (!otp_email) throw new BadRequestException();
        return await this.userService.verifyOtpEmail(user.id, dto, otp_email)
    }

    @Patch('/change-username')
    async updateUsername(@Body() dto: UpdateUsernameDto, @GetUser() user: ITokenPayloadUser) {
        return await this.userService.updateUsername(user.id, dto)
    }
}