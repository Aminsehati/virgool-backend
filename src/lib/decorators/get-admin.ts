import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayloadAdmin } from '../types/token.interface';

export const GetAdmin = createParamDecorator(
  (_data, ctx: ExecutionContext): ITokenPayloadAdmin => {
    return ctx.switchToHttp().getRequest().user;
  },
);