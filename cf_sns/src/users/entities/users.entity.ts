/* 
    id : number

    nickname: string

    email : string

    password : string

    role: [RolesEnum.USER, RolesEnum.ADMIN]
*/

import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "./const/roles.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { MessagesModel } from "src/chats/messages/entity/messages.entity";
import { CommentsModel } from "src/posts/comments/entity/comments.entity";
import { UserFollowersModel } from "./user-followers.entity";

@Entity()
export class UsersModel extends BaseModel{
    @Column({
        // 1 길이
        length : 20,
        // 2 유일무이한 값 
        unique : true,
    })
    // 1) 길이가 20을 넘지 않을것 
    // 2) 유일무이한 값이 될것
    @IsString({
        message : stringValidationMessage,
    })
    @Length(1, 20, {
       message: lengthValidationMessage , })
    nickname : string;

    @Expose()
    get nicknameAndEmail() {
        return this.nickname + '/' + this.email;
    }

    @Column({
        unique: true,
    })
    // 1) 유일무이한 값이 될 것
    @IsString( {
        message : stringValidationMessage,
    })
    @IsEmail({}, {
        message: emailValidationMessage,
    })
    email : string;

    @Column()
    @IsString( {
        message : stringValidationMessage,
    })
    @Length(3, 8 , {
        message: lengthValidationMessage ,
    })
    /*  
        Request
        frontend -> backend
        plain object (JSON) -> class instance(dto)

        Response
        backend -> frontend
        class instance(dto) -> plain object(JSON)

        toClassOnly -> class instance로 변환될때만 (Request)
        toPlainOnly -> plain object로 변환될때만 (Response)

    */
    @Exclude({
        toPlainOnly: true, // JSON으로 변환할 때 제외
        toClassOnly: true, // JSON에서 클래스 객체로 변환할 때 제외
    })
    password : string;
    // password Exclude 로 제외

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER, // 아무넣지 않은상태에서 기본값 USER 로 설정
    })
    role: RolesEnum;
    /* 
        데이터베이스에서는 enum이라는 데이터타입이 없으므로 TypeORM 기능으로 enum mapping
        아무런 입력값이 없으면 USER를 기본값으로 설정
    */

    @OneToMany(() => PostsModel , (post) => post.author)
    posts : PostsModel[];
    /* 
        One(현재Entity) To Many(상대Entity)
        @OneToMany(target Entity , 관계 정의)
        1. target Entity
        TypeScript는 런타임에 타입정보를 유지하지 않으므로,
        TypeORM은 데코레이터를 통해 타겟 엔티티의 타입정보를 런타임에 알 수 있도록 함
        () => postsModel은 지연로딩방식(Lazy)으로 엔티티 타입을 반환

        왜 PostModel을 직접넣지 않고 함수로 작성 하는가?
        ts는 컴파일 후 타입정보를 유지않아 직접적으로 참조하면 런타임에 관계를 제대로 설정 불가함
        이를 해결하기위해 런타임에 호출 가능한 함수 형태로 작성, 엔티티 타입을 동적으로 가져옴

        2. 관계 정의
        이 값은 역방향 관계(반대쪽 엔티티에서 현재 엔티티로의 관계)를 정의 
        첫번째 인수만으로 관계를 정의할수 있지만 양방향 관계를 설정할수 없어
        명시하는 것이 두번째 인수
        
    */

    @OneToMany(() => CommentsModel, (comment) => comment.author)
    postComments: CommentsModel;

    @ManyToMany(() => ChatsModel, (chat) => chat.users) 
    @JoinTable()
    chats: ChatsModel[]

    @OneToMany(() => MessagesModel, (message) => message.author)
    messages: MessagesModel;

    // 내가 팔로우
    @OneToMany(() => UserFollowersModel, (ufm) => ufm.follower)
    followers: UserFollowersModel[];

    // 나를 팔로우 
    @OneToMany(() => UserFollowersModel, (ufm) => ufm.followee)
    followees: UserFollowersModel[];
    
    @Column({
        default: 0
    })
    followerCount: number;

    @Column({
        default: 0
    })
    followeeCount: number;
}