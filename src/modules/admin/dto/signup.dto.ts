import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from "class-validator";

export class SignupDto {
    @ApiProperty({})
    @IsNotEmpty()
    @IsString()
    firstName: string

    @ApiProperty({})
    @IsNotEmpty()
    @IsString()
    lastName: string

    @ApiProperty({})
    @IsNotEmpty()
    @IsString()
    username: string


    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('IR')
    @IsNumberString()
    mobile: string


    @ApiProperty()
    @IsNotEmpty()
    password: string
}