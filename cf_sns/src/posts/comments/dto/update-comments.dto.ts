import { PartialType } from "@nestjs/mapped-types";
import { CreateCommentsDto } from "./createCommentsDto";

export class UpdateCommentsDto extends PartialType(CreateCommentsDto) {
    

    /* 
    PartialType 왜 사용 하는가?

    1. 기존 DTO 재사용
    2. 업데이트 요청에 적합
    3. 코드 중복 방지

    동작원리 
    1. 주어진 DTO클래스의 속성을 모두 선택적으로 변경
    2. 속성을 받아와 ? optional 을 줘서 선택적으로 변경가능

    */

}