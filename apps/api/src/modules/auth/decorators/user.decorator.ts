import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // In HTTP, user is attached to request. In WS, it's client.
    // This decorator assumes HTTP or standard Request flow.
    return request.user;
  },
);
