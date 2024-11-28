import { BaseModel } from "src/common/entity/base.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    
    @Column()
    author : string;

    @Column()
    post : string;

    @ManyToOne(() => PostsModel, (post) => post.comments)
    comments : PostsModel; 
    
    @Column()
    likeCount: number;

    


}