import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { join } from "path";
import { POST_PUBLIC_IMAGE_PATH } from "src/common/const/path.const";
import { BaseModel } from "src/common/entity/base.entity";
import { ImageModel } from "src/common/entity/image.entity";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentsModel } from "../comments/entity/comments.entity";

@Entity()
export class PostsModel extends BaseModel {
    
    // 1) UsersModel과 연동한다 Foreign Key를 이용해서
    // 2) null 이 될 수 없다.
    //
    
    
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,  // 원래 프로덕션에서는 마이그레이션 파일이라는것을 작성, 특정 컬럼 생성했을떄 기존값에 위배되는값에대하여 작성
    })
    author : UsersModel;
    
    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    title: string;
    
    @Column()
    @IsString({
        message: stringValidationMessage,
    })
    content: string;

    // @Column({
    //     nullable: true,
    // })
    // @Transform(({value}) => value && `/${join(POST_PUBLIC_IMAGE_PATH , value)}` ) 
    // // && 앞에식이 false면 뒤에 식은 실행되지않습니다. 즉 value가 false일때 실행되지않는데 
    // // JS에서 숫자0 , null, undefined , NaN, '' 빈문자열을 다 false로 인식합니다.
    // image?: string;
    
    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;

    @OneToMany((type) => ImageModel, (image) => image.post) 
    images: ImageModel[];

    @OneToMany(() => CommentsModel, (comment) => comment.post)
    post: CommentsModel[]
}