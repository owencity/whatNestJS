import { IsNumber, IsOptional, IsString } from "class-validator";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

export class PaginatePostDto extends BasePaginationDto{
    @IsNumber()
    @IsOptional()
    where__likeCount__more_than: number;

    @IsString()
    @IsOptional()
    where__title__i_like: string;
}
    
    // @IsNumber()
    // @IsOptional()
    // page? : number;

    // @IsNumber()
    // @IsOptional()
    // where__id_less_than?: number;

    // // 이전 마지막 데이터의 ID
    // // 이 프로퍼티에 입력된 ID보다 높은 ID부터 값을 가져오기
    // // @Type(() => Number)
    // @IsNumber()
    // @IsOptional()
    // where__id_more_than?: number;

    // // 정렬
    // // createdAt -> 생성된 시간의 내림차/오름차 순으로 정렬
    // @IsIn(['ASC', 'DESC'])
    // @IsOptional()
    // order__createdAt: 'ASC' | 'DESC' = 'ASC';


    // @IsNumber()
    // @IsOptional()
    // take: number = 20;
