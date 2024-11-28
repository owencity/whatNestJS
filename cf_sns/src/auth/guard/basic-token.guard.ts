/* 
    구현할 기능 

    1. 요청 객체 (request)를 불러오고
    authorization header로부터 토큰을 가져온다.
    2. authService.extractTokenFromHeader를 이용해서 사용 할 수 있는 형태의 토큰을 추출한다.
    3. authService.decodeBasicToken을 실행해서 email과 password를 추출한다.
    4. email과 password 이용해서 사용자를 가져온다.
    authService.authenticateWithEmailAndPassword 
    5. 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
    req.user = user;

*/

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate{
    /* 
        CanActivate 
        NestJS의 인터페이스, 가드를 구현하기 위해 사용됨
        클라이언트 요청이 특정 경로에 접근할 수 있는 여부를 결정하는 역할
    */
    constructor(private readonly authService: AuthService) {}
    // 생성자에서 private 또는 public 과 같은 접근제어자를 사용하면, 타입스크립트의 기본 문법으로
    // 클래스의 필드가 자동으로 선언되고 초기화된다. 이를 파라미터 프로퍼티라고 한다.
    // 타입스크립트의 파라미터 프로퍼티 기능

    /* 
        클래스 필드 선언 방식과 생성자 매개변수 방식이 있다.
        NestJS에서는 주로 생성자 매개변수 방식을 사용
    */

    async canActivate(context: ExecutionContext): Promise<boolean> {
        /* 
            async 비동기함수는 항상 Promise 객체를 반환 
            Promise 객체 반환 받기위해 타입 지정
            boolean 값을 포함하는 Promise객체를 반환
        */
        const req = context.switchToHttp().getRequest();

        /* 
            NestJS는 HTTP, WebSocket, RPC등 다양한 프로토콜을 지원 
            현재 실행 컨텍스트의 종류에 따라 적절한 요청 객체를 가져오기 위해 사용

            *실행컨텍스트란? 
            NestJS에서 현재 실행중인 요청이나 이벤트와 관련된 실행 환경을 의미
            각 프로토콜에 따라 실행 환경을 구분하고 이를 관리하는 개념

            context : ExecutionContext 객체로, 현재 실행중인 컨텍스트에 대한 정보를 제공(예: HTTP 요청, WebSocket 이벤트, RPC 호출 등)
            switchToHttp() : 컨텍스트를 HTTP 컨텍스트로 전환
        */

        const rawToken = req.headers['authorization'];

        if(!rawToken) {
            throw new UnauthorizedException('토큰이 없습니다');
        }

        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const {email, password} = this.authService.decodeBasicToken(token);

        const user = await this.authService.authenticateWithEmailAndPassword({
            email,
            password,
        });

        req.user = user;

        return true;
    }
}