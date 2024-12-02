import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}

/* 
abstract class 로 선언한 이유
이클래스가 직접적으로 인스턴스화 되지않고 , 다른 엔티티 클래스에서 확장해서 사용하도록 설계

abstract class 의 의미
이 클래스는 직접 사용할 수 없고, 반드시 상속을 통해서만 사용해야 한다는것을 의미
직접 객체 생성 X 

abstract를 붙이면, 해당 클래스를 직접 사용하려고하면 컴파일 에러가 발생하여 잘못된 사용을 방지 
다른이에게 이클래스는 상속용으로 설계되었다를 명확히 의도를 전할 수 있다.

일반 class로 선언할경우 실수로 인스턴화 할시 데이터베이스에 직접적인 영향을 줄수 있음 
의도의 명확성 부족 -> 코드리뷰 또는 유지보수 시 오해를 초래

abstract -> JS에서는 없는 개념 이지만 
typescript에서는 키워드를 지원하여 추상클래스와 추상메서드를 정의 할 수 있음
런타임에서는 일반 클래스 처럼 동작
js에서 동일한 동작(new.target)을 활용하거나 에러를 명시적으로 던지는 방식 사용
*/