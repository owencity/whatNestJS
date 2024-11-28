import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { dot } from "node:test/reporters";
import { CreateMessagesDto } from "./messages/dto/create-messages.dto";
import { ChatsMessagesService } from "./messages/messages.service";
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";
import { SocketBearerTokenGuard } from "src/auth/guard/socket/socket-bearer-token.guard";
import { UsersModel } from "src/users/entities/users.entity";
import { combineLatestInit } from "rxjs/internal/observable/combineLatest";


// 브로드캐스팅 : 나를 제외하고 모두에게 보내는것
@WebSocketGateway({
    // /chats
    namespace: 'chats'
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: ChatsMessagesService,
    ) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log(`after gateway init`);
    }
    
    handleDisconnect(socket : Socket) {
        console.log(`on disconnect called : ${socket.id}`);
    }


    handleD

    handleConnection(socket: Socket) {
        console.log(`on connect called: ${socket.id}`);

    }
/* 
    nestjs 에서 기본적으로 validationPipe는 HTTP 요청,응답 처리와 관련된 HTTP 예외(BadRequestException)을 던진다.
    이 예외는 HttpException 클래스를 상속받아 HTTP 기반 애플리케이션에서 적합하게 처리된다.
    웹소켓에서는 WsException을 사용하여 메시징 환경에 맞는 에러 처리를 한다.
    wsException은 HTTP 상태코드가 없는 단순한 예외로 , 메시징 중심의 애플리케이션에 적합하다.
    WebSocket 환경에서 기본 validationPipe가 던지는 HTTP 관련 예외는 WebSocket에 직접적으로 적합하지 않으므로
    웹소켓 서버가 이를 처리못하고 서버측에서 오류가 발생할 수 있다.
*/
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
              enableImplicitConversion: true
            },
            whitelist: true,
            forbidNonWhitelisted: true,
          })
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @UseGuards(SocketBearerTokenGuard)
    @SubscribeMessage('create_chat')
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel},
    ) {
       const chat = await this.chatsService.createChat(
            data,
       ); 
    }

    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
              enableImplicitConversion: true
            },
            whitelist: true,
            forbidNonWhitelisted: true,
          })
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @UseGuards(SocketBearerTokenGuard)
    @SubscribeMessage('create_chat')
    @SubscribeMessage('enter_chat')
    async enterChat(
        // 방의 ID들을 리스트로 받는다.
        @MessageBody() data: EnterChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
        for(const chatId of data.chatIds) {
            const exists = await this.chatsService.checkIfChatExists(
                chatId,
            );
        

        if(!exists) {
            throw new WsException({
                message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
                code : 100,
            });
        }
    }

        socket.join(data.chatIds.map((x) => x.toString()));
    }

    // socket.on('send_message', (message) => console.log(message));
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
              enableImplicitConversion: true
            },
            whitelist: true,
            forbidNonWhitelisted: true,
          })
    )
    @UseFilters(SocketCatchHttpExceptionFilter)
    @UseGuards(SocketBearerTokenGuard)
    @SubscribeMessage('create_chat')
    @SubscribeMessage('send_message')
    async sendMessage(    
        @MessageBody() dto: CreateMessagesDto,
        @ConnectedSocket() socket: Socket & {user: UsersModel}
    ) {
        const chatExists = await this.chatsService.checkIfChatExists(
            dto.chatId,
        );

        if(!chatExists) {
            throw new WsException(
                `존재하지않는 채팅방입니다. Chat ID : ${dto.chatId}`,
            );
        }

        const message = await this.messagesService.createMessage(
            dto,
            socket.user.id
        );

        socket.to(message.chat.id.toString()).emit("receive_message", message.message); // broadcasting 기능(나를 제외)
        // this.server.in(message.chatId.toString()).emit('receive_message', message.message) 
        // this.server -> 모든소켓의 서버에 보냄(나 포함)
    }

   
}