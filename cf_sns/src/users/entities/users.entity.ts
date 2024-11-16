/* 
    id : number

    nickname: string

    email : string

    password : string

    role: [RolesEnum.USER, RolesEnum.ADMIN]
*/

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "./const/rolse.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";

@Entity()
export class UsersModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        // 1 길이
        length : 20,
        // 2 유일무이한 값 
        unique : true,
    })
    // 1) 길이가 20을 넘지 않을것 
    // 2) 유일무이한 값이 될것
    nickname : string;


    @Column({
        unique: true,
    })
    // 1) 유일무이한 값이 될 것
    email : string;

    @Column()
    password : string;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER, // 아무넣지 않은상태에서 기본값 USER 로 설정
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostModel[];

}