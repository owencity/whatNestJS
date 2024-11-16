import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostsModel {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    // 1) UsersModel과 연동한다 Foreign Key를 이용해서
    // 2) null 이 될 수 없다.
    @ManyToOne(() => UsersModel, (user) => user.posts, {
        nullable: false,  // 원래 프로덕션에서는 마이그레이션 파일이라는것을 작성, 특정 컬럼 생성했을떄 기존값에 위배되는값에대하여 작성
    })
    author : UsersModel;
    
    @Column()
    title: string;
    
    @Column()
    content: string;
    
    @Column()
    likeCount: number;
    
    @Column()
    commentCount: number;
}