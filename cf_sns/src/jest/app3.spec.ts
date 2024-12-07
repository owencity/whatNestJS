/* 
    메서드 실존 x, 가정
*/

import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";
import {Test, TestingModule} from '@nestjs/testing'

describe("Auth 컨트롤러 테스트하기 " , () => {
    let appService: AppService;
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile(); // compile -> 최적화, 의존성 주입을 해준다. 

        app.get(AppController); // 의존성 주입된 AppController 을 뽑아옴
    });

    describe("getHello 테스트하기", () => {
        
        test("이 테스트의 검증 결과는 hello world 리턴해야한다", () => {
            expect(appController.getHello()).toBe('hello world');
        });

        
        /* 
            provide 에넣으면 알아서 의존성 주입, 
            yarn start:dev 

            yarn test => nest와 상관이없다 , spec만 실행 (의존성 주입이 안된다)
        */
    });
    
    describe("fetchBoard 테스트하기", () => {

    });

    describe("createBoard 테스트하기", () => {

    });
})