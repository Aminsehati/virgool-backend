import { Injectable } from '@nestjs/common';
import { compare, hash, hashSync } from 'bcrypt';

@Injectable()
export class HashService {
    async hashString(str: string) {
        return hash(str, 10);
    }

    async verifyHash(plain: string, hashed: string) {
        return compare(plain, hashed);
    }
    async s() {
        return
    }
}