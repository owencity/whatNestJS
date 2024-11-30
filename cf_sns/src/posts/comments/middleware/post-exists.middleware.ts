import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class PostExistMiddleware implements NestMiddleware {
    constructor(
        private readonly postService: PostsService,
    ) {}

   async use(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        if(!postId) {
            throw new BadRequestException (
                'Post ID 파라미터는 필수입니다.'
            );
        }
        const exist = await this.postService.checkPostExistById(
            parseInt(postId),
        );

        if(!exist) {
            throw new BadRequestException(
                'Post가 존재하지 않습니다.'
            );
        }
        next();
    }
}

/* 
    NestJS는 기본적으로 Express를 내부적으로 사용하여 HTTP 요청과 응답을 처리함.
    NestJS는 Express 위에 추상화를 제공함
    NextFunction은 Express의 미들웨어 체인을 관리하는 함수 

    미들웨어는 클라이언트의 요청과 서버의 응답사이에 실행되는 함수 
    미들웨어는 요청과 응답을 가로채서 특정 작업을 수행또는 다음단계로 요청을 넘길지 결정하는 역할
    
    대략적인 NestJS 사이클 요약

    1. 미들웨어
    - 요청이 애플리케이션으로 들어오자마자 실행
    - Express의 미들웨어와 유사하게 동작, 요청을 수정 또는 특정 작업을 수행할 수 있음
    - next()를 호출하여 요청을 다음단계로 넘김(필수)
    - 컨트롤러 레벨에서 동작하지않고 , 라우트에 들어가기전에 실행
    => 컨트롤러 메서드가 실행되기전 미들웨어가 실행된다는 뜻
    2. 가드 

    - 요청이 컨트롤러 들어오기전에 실행, 인증 및 권한 확인에 주로 사용
    - true를 반환하면 요청이 계속 진행 , false면 요청 중단
    - 요청의 실행 여부를 결정

    3. 파이프
    - 데이터 검증 및 변환에 사용
    - 요청 데이터(예: DTO)를 변환 또는 검증, 실패시 예외를 던짐
    - 컨트롤러가 요청을 처리하기전에 실행

    4. 인터셉터
    - 요청과 응답의 전후에 동작
    - 요청 전/후 로깅, 응답 데이터를 수정하는 데사용
    - 응답을 가공하거나 메타프로그래밍을 활용하는 경우에 유용
    
    */