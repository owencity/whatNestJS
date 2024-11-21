/* 
    DTO - Data Transfer Object
    DTO는 API 1:1 mapping 이 아닌경우가 있어서 create-post dto로 네이밍
*/

import { PostsModel } from "../entities/posts.entity";
import { PickType } from "@nestjs/mapped-types";

// Pick, Omit, Partial -> Type반환 , Type반환은 상속을 받을수없다. 
// PickType, OmitType, PartialType -> 값을 반환 

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
// title, content의 값만 쓰기위해 Pick 해서 값을 받아 상속 

    // title: string;
    // content: string;
