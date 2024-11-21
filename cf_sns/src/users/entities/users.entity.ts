/* 
    id : number

    nickname: string

    email : string

    password : string

    role: [RolesEnum.USER, RolesEnum.ADMIN]
*/

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "./const/rolse.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";

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
        toPlainOnly: true,
    })
    password : string;

    @Column({
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER, // 아무넣지 않은상태에서 기본값 USER 로 설정
    })
    role: RolesEnum;

    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostModel[];

}