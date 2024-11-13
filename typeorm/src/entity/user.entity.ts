import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

@Entity()
export class UserModel{
    
    // @PrimaryGeneratedColumn('uuid') // 자동 ID생성  Generated -> 생성되는 
    // 기본적으로 순서대로 위로올라간다. uuid를 사용시 수학적으로 어떤 값이 생성?  
    // @PrimaryColumn() // 모든 테이블에서 기본적으로 존재해야한다. , 테이블 안에서 각각의 Row를 구분 할 수 있는 칼럼이다. (자동생성x), 우리가 직접넣겠다.
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        // 데이터 베이스에서 인지하는 칼럼 타입
        // 자동으로 유추, 안넣어도되지만 특정한 유추한 타입을 넣으려면 지정해줘야함
        type:'varchar',
        // 데이터 베이스 칼럼 이름 
        // 프로퍼티 이름으로 자동 유추
        name:'_title',
        // 값의 길이
        length: 300,
        // null 이 가능한지
        nullable: true,
        // true 면 처음 저장할때만 값 지정 가능 
        // 이후에는 값 변경 불가능,
        update: false,
    })
    title: string;
    
    @CreateDateColumn() // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
    createdAt: Date;
    
    @UpdateDateColumn() // 업데이트 되는 날짜와 시간이 자동으로 찍힌다.
    updatedAt: Date;

    @VersionColumn() // 데이터가 업데이트 될때마다 1씩 올라간다 , 처음 생성되면 값은 1이다. , save() 함수가 몇번 불렸는지 기억한다.
    version: number;

    @Column()
    @Generated('increment') // 자동으로 1씩 올라가는 기능 column 과 세트
    additionalId: number;
}