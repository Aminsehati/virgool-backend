import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsNumberString } from "class-validator";

export class sendOtpMobileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    @IsMobilePhone('fa-IR')
    mobile: string
}