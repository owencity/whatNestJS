import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";

@Injectable() // SocketBearerTokenGuard를 provider로 만들기위함, 다른곳에 의존성 주입할수 있도록
export class SocketBearerTokenGuard implements CanActivate {
    // CanActivate -> NestJS의 Guard를 구현하기 위한 인터페이스
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {}

    /* 
        private readonly 쓰는 이유?
        OOP 원칙을 따르고, 코드의 안정성과 가독성을 높이기 위함 
        private : 캡슐화 , readonly : 초기화 이후 변경불가(불변성)
        의도 명확화 -> 이속성이 외부에 노출되지않은며, 클래스 내부에서도 수정되지 않는다는 의도를 "명학"히 전달
    */
    
        async canActivate(context: ExecutionContext):   Promise<boolean> { 
            
            /* 
                ExecutionContext는 NestJS에서 제공하는 실행 컨텍스트 객체,
                현재 실행중인 요청과 관련된 정보를 제공하는 역할
                (예: HTTP, WebSocket 등 )
            */
            const socket = context.switchToWs().getClient();
            
            const headers = socket.handshake.headers;
            /* 
                웹소켓 연결과정에서 http 핸드쉐이크 요청에 포함된 헤더정보를 가져오는 것 
                핸드쉐이크 이후 웹소켓 동작하는데 양방향 통신이 시작되고
                이 시점 이후에는 헤더 정보를 전송할 수없습니다. 
                -> WebSocket 메시지에는 헤더개념이 없으며, 메시지 페이로드에 데이터를 포함시켜야합니다.
                메시지 페이로드에 포함시킬수는 있지만 보안에 위험을 야기할수있으므로 권장하지 않는다.
                페이로드는 네트워크 상에서 쉽게 노출될수 있고 재전송의 위험이 있다.
                */


            // Bearer 
            const rawToken = headers['authorization'];
            /* 
                브래킷 표기법, 객체 프로퍼티 접근 방식중 하나 
                headers 객체에 속한 authorization 키의 값을 가져온다.
            */
    
            if(!rawToken) {
                throw new WsException('토큰이 없습니다!');
            }
            try {
                const token = this.authService.extractTokenFromHeader(
                    rawToken,
                    true,
                );
        
                const payload = this.authService.verifyToken(token);
                // token 에 포함된 페이로드 반환
                const user = await this.userService.getUsersByEmail(payload.email);
                // payload의 email 값을 통해 지금의 user 의 email값 반환
                socket.user = user;
                socket.token = token;
                socket.tokenType = payload.tokenType;
            
                return true;
            } catch (e) {
                throw new WsException('토큰이 유효하지 않습니다.')
            }
          
        }
    
}