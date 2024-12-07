/* 
    메서드 실존 x, 가정
*/

import { AppController } from "src/app.controller";
import { AppService } from "src/app.service";

describe("Auth 컨트롤러 테스트하기 " , () => {
    let appService: AppService;
    let appController: AppController;

    beforeEach(() => {
        appService = new AppService();
        appController = new AppController(appService);
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