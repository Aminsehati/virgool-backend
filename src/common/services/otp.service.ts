import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
    randomCode(length: number) {
        return randomInt(10 ** length - 1)
            .toString()
            .padStart(length, '0');
    }
}