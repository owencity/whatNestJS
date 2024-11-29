import { IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entity/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity,  ManyToOne} from "typeorm";

@Entity()
export class CommentsModel extends BaseModel{

    /* 
        관계 정리 
        게시글 하나에 댓글 여러개 
        id와 매핑
        Post (Many) -> comment(One) 
        게시글 조회시 댓글 가지고와야함  
    */
    // 작성자-> 
    
    @ManyToOne(() => UsersModel, (user) => user.postComments)
    author : UsersModel;

    @ManyToOne(() => PostsModel, (post) => post.comments)
    post : PostsModel;

    @Column()
    @IsString()
    comment: string;

    @Column({
        default: 0,
    })
    @IsNumber()
    likeCount: number;

    


}