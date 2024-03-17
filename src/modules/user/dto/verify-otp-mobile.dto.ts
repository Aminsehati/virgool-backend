import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsNumberString, Length, MaxLength, MinLength } from "class-validator";

export class VerifyOtpMobileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumberString()
    @IsMobilePhone('fa-IR')
    mobile: string


    @ApiProperty()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(4)
    code: string
}