import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
    constructor (
        private readonly jwtService: JwtService,
    ) {}


/* 
    우리가 만드려는 기능 

    1) registerWithEmail
    - email, nickname, password를 입력받고 생성한다.
    - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
    - 회원가입 후 로그인해주세요 -> 이 과정을 방지 하기위해 회원가입후 바로반환, 프론트엔드에서 회원가입후 바로 로그인처리
    
    2) loginWithEmail
    - email, password를 입력하면 사용자 검증을 진행한다.
    - 검증이 완료되면 accessToken 과 refreshToken을 반환한다. 

    3) loginUser
    - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직

    4) signToken
    - (3)에서 필요한 accessToken 과 refreshToken을 sign하는 로직

    5) authenticateWithEmailAndPassword 
    - (2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행
    1. 사용자가 존재하는지 확인 (email)
    2. 비밀번호가 맞는지 확인
    3. 모두 통과되면 찾은 사용자 정보 반환
    4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
*/


/* 
    payload에 들어갈 정보 -> 아무나 들여다볼수있음
    1. email (민감한정보 넣기 싫다면 추후에 빼도된다.) 
    2. sub -> id
    3. type -> access 인지 refresh 인지 
*/

signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
        email: user.email,
        sub: user.id,
        type: isRefreshToken? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: isRefreshToken ? 3600 : 300,
    });
}
}