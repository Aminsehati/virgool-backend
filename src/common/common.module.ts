import { Module } from "@nestjs/common";
import { HashService } from "./services/hash.service";
import { OtpService } from "./services/otp.service";
import { PublicService } from "./services/public.service";

@Module({
    imports: [],
    controllers: [],
    providers: [PublicService, OtpService, HashService],
    exports: [PublicService, OtpService, HashService]
})

export class CommonModule {

}