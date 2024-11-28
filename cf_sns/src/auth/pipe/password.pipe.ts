import {PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from '@nestjs/common'

/* 
    아래 방식은 NestJS 사용자 정의 Pipe를 작성하는 가장 기본적인(고전적인) 방식
    사용자 정의 Pipe를 직접 구현하고 적용하는 전형적인 방법 
    데코레이터 기반 class-validator를 활용한 선언적 방식이 더 체계적이고 현대적인 방식, 복잡한 검증로직에 권장
    class-validator와 같은 라이브러리는 데코레이터 기반의 선언적 방식으로 검증 로직을 처리
    
    무조건 class-validator를 사용해야하는 것은 아니며 상황에 따라 가장 적합한 방식을 선택하는 것이 중요

    Pipe를 쓰는 이유?

    Pipe는 주로 데이터 변환 및 유효성 검증 
    Guard는 요청의 인증 및 권환 관리에 사용됨

    1. 데이터 변환

    Pipe는 요청 데이터를 컨트롤러나 핸들러에서 사용할 수 있는 형태로 반환
    예: string으로 전달된 ID를 숫자로 변환하거나, 데이터 구조를 재정렬.

    NestJS 의 책임 분리 원칙 , 철학 이며 설계원칙 중 하나인 SOLID원칙과 모듈화된 아키텍처에서 비롯된것
    타 프레임워크언어에서도 흔히 사용되는 설계 원칙을 쳬계적으로 구현한 것

     NestJS는 특히 단일 책임 원칙을 철처히 따르며
     Pipe, Guard, Interceptor, Filter 등은 각각의 책임을 명확히 분리하여 설계
     Pipe: 데이터 변환 및 검증
     Guard: 인증 및 권한 및 확인
     Interceptor: 요청/응답 로깅 및 데이터 가공
     Filter: 에러처리
*/

@Injectable()
export class PasswordPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {
        if(value.toString().length > 8 ) {
            throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요.')
        }
        return value.toString(); 
    }

}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
    constructor(private readonly length: number) {

    }

    transform(value: any, metadata: ArgumentMetadata) {
        if(value.toString().length > this.length){
            throw new BadRequestException(`최대 길이는 ${this.length}입니다.`)
        }
        return value.toString();
    }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
    constructor(private readonly length: number) {}

    transform(value: any, metadata: ArgumentMetadata) {
        if(value.toString().length < this.length) {
            throw new BadRequestException( `최소 길이는 ${this.length}입니다.`)
        }

        return value.toString();
    }
}