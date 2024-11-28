import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "src/users/entities/users.entity";

export class RegisterUserDto extends PickType(UsersModel, ['nickname', 'email', 'password']) {}

/* 
    Picktype -> NestJs에서 제공하는 유틸리티
    유효성 검사 지원(class-validator)
    DTO 관련된 클래스 기반 상속 작업에 사용
    타입스크립트에는 Pick 이있고 서로 다른목적으로 사용하지만 기능이 유사한 부분이 있다.
    Pick<User, 'nickname' | 'email' | 'password'>
    인터페이스나 타입에서 특정 속성만 선택하여 새로운 타입을 정의 
    정적 타입 검사에만 사용되며, 클래스 기반의 동작은 아님
    */