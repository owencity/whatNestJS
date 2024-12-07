import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "../entities/const/roles.const";

export const ROLES_KEY = 'user_roles';

//@Roles(RolesEnum.ADMIN) 
export const Roles = (role : RolesEnum) => SetMetadata(ROLES_KEY, role); 

/* 
    SetMetaData는 메타데이터를 클래스, 메서드, 속성에 설정하기 위한 유틸리티 함수
    이를 통해 런타임에 Guard 나 Interceptor등에서 사용할 추가 정보를 제공

    주요 사용 사례:
    1. 역할 기반 접근 제어
    2. 플래그 설정(인증 여부, 캐싱 등)
    3. 기타 커스텀 로직에 필요한 데이터 전달.

    메타데이터란 ? 
    데이터에 대한 데이터를 의미, 어떤 데이터의 속성, 정보, 구조 또는 의미를 설명하는 부가적인 정보 

    왜 SetMetaData를 사용해 @Roles 데코레이터를 구현했는가?
    NestJS가 제공하는 Guard 나 Interceptor같은 런타임 로직에 역할(Role)정보를 읽기 쉽게 메타데이터를 추가하기 위해서

    Guard에서 메타데이터를 읽기위해 Reflector를 사용, Reflector는 SetMetadata로 설정된 데이터를 읽을 수 있음

    NestJS 데코레이터는 직접적인 데이터 전달이 아니라 , 대상(클래스, 메서드) 등에 추가 정보를 설정하는 방식으로 동작
    이 추가 정보가 바로 메타데이터

    만약 SetMetaData없이 Role을 직접 Guard에 전달하려면 , 데코레이터가 Guard와 직접 연결되어야하는데 
    이는 NestJS의 구조와 철학에 어긋나는 방식
    */