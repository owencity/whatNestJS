import { Column, CreateDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { ProfileModel } from "./profile.entity";
import { PostModel } from "./post.entity";

export enum Role{
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class UserModel{
    
    // @PrimaryGeneratedColumn('uuid') // 자동 ID생성  Generated -> 생성되는 
    // 기본적으로 순서대로 위로올라간다. uuid를 사용시 수학적으로 어떤 값이 생성?  
    // @PrimaryColumn() // 모든 테이블에서 기본적으로 존재해야한다. , 테이블 안에서 각각의 Row를 구분 할 수 있는 칼럼이다. (자동생성x), 우리가 직접넣겠다.
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
    // @Column({
    //     // 데이터 베이스에서 인지하는 칼럼 타입
    //     // 자동으로 유추, 안넣어도되지만 특정한 유추한 타입을 넣으려면 지정해줘야함
    //     type:'varchar',
    //     // 데이터 베이스 칼럼 이름 
    //     // 프로퍼티 이름으로 자동 유추
    //     name:'_title',
    //     // 값의 길이, string이나 varchar 에는 지원하나 text 타입에는 지원하지않음
    //     length: 300,
    //     // null 이 가능한지
    //     nullable: true,
    //     // true 면 처음 저장할때만 값 지정 가능 
    //     // 이후에는 값 변경 불가능,
    //     update: false,
    //     // find()를 실행할 때 기본으로 값을 불러올지 
    //     // 기본값이 true,
    //     select: false,
    //     // 기본값 
    //     // 아무것도 입력 안했을 때 기본으로 입력되게 되는 값
    //     default: 'default value',
    //     // 컬럼중에서 유일무이한 값이 돼야하는지
    //     unique: false,
    // })
    // title: string;//

    @Column({
        type: 'enum',
        enum: Role, 
        default: Role.USER,
    })
    role : Role;
    
    @CreateDateColumn() // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
    createdAt: Date;
    
    @UpdateDateColumn() // 업데이트 되는 날짜와 시간이 자동으로 찍힌다.
    updatedAt: Date;

    @VersionColumn() // 데이터가 업데이트 될때마다 1씩 올라간다 , 처음 생성되면 값은 1이다. , save() 함수가 몇번 불렸는지 기억한다.
    version: number;

    @Column()
    @Generated('increment') // 자동으로 1씩 올라가는 기능 column 과 세트
    additionalId: number;

    @OneToOne(() => ProfileModel, (profile) => profile.user, {
        // find() 실행 할때마다 항상 같이 가져올 relation
        eager: false,
        // 저장할 떄 relation 한번에 같이 저장 가능
        cascade: false,
        // null이 가능한지 ?
        nullable: true,
        // 관계가 삭제됐을 때
        // no action -> 아무것도 아함  cascade -> 참조하는 row도 같이 삭제 set null -> 참조하는 row에서 참조 id를 null로 변경
        // set default -> 기본세팅으로 설정 ( 테이블의 기본 세팅)
        // restrict -> 참조하고 있는 row가 있는 경우 참조당하는 row 삭제 불가
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    profile: ProfileModel;

    @OneToMany(() => PostModel, (post) => post.author)
    posts: PostModel[]; 
}