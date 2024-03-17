import { BadRequestException, Body, Controller, Post, Res } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { SwaggerConsumes } from "src/lib/types/swagger";
import { AuthService } from "./auth.service";
import { Response } from 'express'
import { Cookies } from "src/lib/decorators/cookies.decorator";
import { VerifyOtpDto } from "./dto/verify-otp.dto";


@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

    }
    @Post('/user-existence')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async userExistence(@Body() authDto: AuthDto, @Res() res: Response, @Cookies('otp_sign') otp_sign: string) {
        const { otp, sign } = await this.authService.userExistence(authDto);
        if (otp_sign) throw new BadRequestException('کد یکبار مصرف قبلا استفاده شده است');

        res.cookie('otp_sign', sign, {
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

    @Post('verify-otp')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async verifyOtp(@Body() body: VerifyOtpDto, @Cookies('otp_sign') otp_sign: string) {
        if (!otp_sign) throw new BadRequestException()
        return await this.authService.verifyOtp(body, otp_sign)
    }
}