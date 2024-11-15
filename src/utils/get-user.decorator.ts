// auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserID = createParamDecorator(
    (data: keyof Express.User | undefined, context: ExecutionContext) => {
        console.log('GetUser decorator');
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If a specific property is requested (like user.id), return that
        return data ? user?.[data] : user;
    },
);
