import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenPayloadUser } from '../types/token.interface';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): ITokenPayloadUser => {
  return ctx.switchToHttp().getRequest().user;
});