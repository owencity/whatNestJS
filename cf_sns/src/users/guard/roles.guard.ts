import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        /* 
            reflector -> NestJS 에서 제공하는 유틸리티 클래스 , 메타데이터를 읽어오는 기능 제공
            SetMetaData를 설정된 메타데이터를 읽기위해 사용되며, 주요 전역적인 처리에서 활용
            런타임에 클래스 , 메서드 , 속성 등에 설정된 메타데이터를 읽어오는데 사용
            데코레이터로 설정한 메타데이터를 쉽게 조회 할수 있도록 도움

            왜 메타데이터를 사용할까 ?
            enum 값을 바로 사용하는 방식과 비교할때, 확장성, 유지보수성, 코드의 일관성을 위해 사용
            특히 NestJS같은 프레임워크에서 구조화된 접근 방식과 추상화된 처리를 가능하게 해줌

            데이터를 추상적으로 저장하고, 이를 동적으로 처리하며 반복적인 검증로직을 작성하지 않게 하고 
            데코레이터를 통해 필요한 정보를 선언적으로 설정, Guard나 Interceptor같은 공통 모듈에서 일괄적으로 처리할 수 있도록 도움
            
        */
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        /* 
            Roles annotation에 대한 metadata를 가져와야한다.

            Reflector
            getAllAndOverride()
        */
        const requiredRole = this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        // Roles Annotation 등록 안돼있음
        if(!requiredRole) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        if(!user) {
            throw new UnauthorizedException(
                `토큰을 제공 해주세요!`,
            );
        }

        if(user.role !== requiredRole) {
            throw new ForbiddenException(
                `이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`
            );
        }
        
        return true;
    }
}