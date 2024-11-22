import { IsIn, IsNumber, IsOptional } from "class-validator";

export class BasePaginationDto{
    @IsNumber()
    @IsOptional()
    page? : number;

    @IsNumber()
    @IsOptional()
    where__id__less_than?: number;

    // 이전 마지막 데이터의 ID
    // 이 프로퍼티에 입력된 ID보다 높은 ID부터 값을 가져오기
    // @Type(() => Number)
    @IsNumber()
    @IsOptional()
    where__id__more_than?: number;

    // 위와 같은 네이밍 방식은 특별한 필요가 없으면 과도하게 쓰이지 않지만, 동적 로직이 필요하거나 필드의 의미를 명확히 하고 싶을 때 쓰일 수 있다.
    // 프론트엔드와 백엔드가 REST API 나 GraphQL을 통해 통신 할 때 필드 구분을 명확히 하기 위해 쓰이는 경우가 있다. 
    // 예 : 백엔드에서 자동으로 필드명을 분석하거나 , 데이터베이스 필드와 매핑 할 때,
    // 네임 스페이스가 중복될 수 있는 상황(예: 다양한 where조건)에서 충돌을 피하기 위해 사용. 

    // 정렬
    // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    order__createdAt: 'ASC' | 'DESC' = 'ASC';


    @IsNumber()
    @IsOptional()
    take: number = 20;
}