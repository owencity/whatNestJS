import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "./base.entity"
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { join } from "path";
import { POST_IMAGE_PATH, POST_PUBLIC_IMAGE_PATH } from "../const/path.const";
import { PostsModel } from "src/posts/entities/posts.entity";

export enum ImageModelType {
    POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {

    @Column({
        default: 0,
    })
    @IsInt()
    @IsOptional()
    order : number;


    // UserModel -> 사용자 프로필 이미지
    // PostsModel -> 포스트 이미지
    @Column({
        enum: ImageModelType,
    })
    @IsEnum(ImageModelType)
    type : ImageModelType;

    @Column()
    @IsString()
    @Transform(({value, obj}) => { 
        if(obj.type === ImageModelType.POST_IMAGE ) {
            return `/${join( // join 운영체제마다 표현하는게 다르다. 윈도우의 경로구분자는 백슬래쉬 맥의 경로 구분자는 슬래쉬 이다. 
                // string 으로 표현할시 윈도우에서는 \\ 두번쓰게 된다. 
                POST_PUBLIC_IMAGE_PATH,
                value)}`
        } else {
            return value;
        }
    })
    path : string;

    @ManyToOne((type) => PostsModel, (post) => post.images) 
    post?: PostsModel;

}