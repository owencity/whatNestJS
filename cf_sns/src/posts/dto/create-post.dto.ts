/* 
    DTO - Data Transfer Object
    DTO는 API 1:1 mapping 이 아닌경우가 있어서 create-post dto로 네이밍
*/

import { IsOptional, IsString } from "class-validator";
import { PostsModel } from "../entities/posts.entity";
import { PickType } from "@nestjs/mapped-types";

// Pick, Omit, Partial -> Type반환 , Type반환은 상속을 받을수없다. 
// PickType, OmitType, PartialType -> 값을 반환 

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
    
    @IsString({
        each: true, 
    })
    @IsOptional()
    images: string[] = [];
}
// title, content의 값만 쓰기위해 Pick 해서 값을 받아 상속 

    // title: string;
    // content: string;
/* 
    spread  연산자 가능한이유 
    string[]배열로 타입을 지정

    부모와 자식 관계 
    부모 클래스는 단순히 자식 클래스에 일부 속성과 메서드를 제공하는 역할
    자식 클래스에서 새로운 속성을 추가하거나 상속받은 속성을 조합해서 사용가능
*/