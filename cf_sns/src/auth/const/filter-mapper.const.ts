import {
    Any,
    ArrayContainedBy,
    ArrayContains,
    ArrayOverlap,
    Between,
    Equal,
    ILike,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Raw,
} from "typeorm"
/* 
    where__id__not 

    {
        where: {
        id: Not(value)
        }
    }
*/
export const FILTER_MAPPER = {
    not: Not,
    less_than: LessThan,
    less_than_or_equal: LessThanOrEqual,
    more_than: MoreThan,
    more_than_or_equal: MoreThanOrEqual,
    equal: Equal,
    like: Like,
    i_like: ILike,
    between: Between,
    in : In,
    any : Any,
    is_null : IsNull,
    array_contains : ArrayContains,
    array_contains_by : ArrayContainedBy,
    array_overlap: ArrayOverlap,     
}

// 위코드는 다양한 operator(조건자)를 매핑한 객체 
/* 
    동적으로 쿼리를 생성하거나 필터링 조건을 적용하기 위해 사용
    대문자 -> 소문자 매핑으로 쉽게 사용하기 위함, 가독성과 편의성을 높일 수 있다. 
    
*/