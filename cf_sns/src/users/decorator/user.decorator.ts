import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { UsersModel } from "../entities/users.entity";

export const User = createParamDecorator((data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as UsersModel;

    if(!user) {
        throw new InternalServerErrorException('User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다. Request에 user 프로퍼티가 존재하지 않습니다.');
    }

    if(data) {
        return user[data];
    }

    return user;
    /* 
        req.user에 접근하여 사용자 정보를 가져오는 반족적인 작업을 줄이기 위함
        data 매개변수를 통한 usersModel 에서 특정속성(user.id, user.email)만 추출
    */
});