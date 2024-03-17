import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiConsumes, ApiExcludeEndpoint, ApiTags } from "@nestjs/swagger";
import { SignupDto } from "../dto/signup.dto";
import { AuthService } from "../services/auth.service";
import { LoginAdminDto } from "../dto/login-admin.dto";
import { Response } from 'express'
import { SwaggerConsumes } from "src/lib/types/swagger";


@ApiTags('Admin/Auth')
@Controller('/admin/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {

    }
    @Post('/signup')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async signupAdmin(@Body() body: SignupDto) {
        return await this.authService.signupAdmin(body);
    }

    @Post('/login')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async loginAdmin(@Body() body: LoginAdminDto) {
        return await this.authService.loginAdmin(body);
    }

    @Post('/oauth2-login')
    @ApiExcludeEndpoint()
    async oauth2Login(@Body() body: LoginAdminDto, @Res() res: Response) {
        const { access_token, refresh_token, admin } = await this.authService.loginAdmin(body);
        return res.json({
            access_token,
            refresh_token,
            admin
        })
    }
}