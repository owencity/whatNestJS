import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { ENV_HASH_ROUNDS_KEY, ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';

@Injectable()
export class AuthService {
    constructor (
        private readonly jwtService: JwtService,
        private readonly usersService : UsersService,
        private readonly configService: ConfigService,
    ) {}

    /* 
        토큰을 사용하게 되는 방식

        1. 사용자가 로그인 또는 회원가입을 진행하면
        access 토큰과 refreshToken을 발급 받는다.
        2. 로그인 할때는 Basic 토큰과 함께 요청을 보낸다. 
            Basic 토큰은 '이메일:비밀번호'를 Base64로 인코딩한 형태이다.
            예 authorization: 'Basic {token}'}
        3. 아무나 접근 할 수 없는 정보 (private route)를 접근 할 때는
        accessToken을 Header에 추가해서 요청과 함께 보낸다. 
        예) {authorization: 'Bearer {token}'}
        4. 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 
        사용자가 누구인지 알 수 있다.
        예를 들어서 현재 로그인한 사용자가 작성한 포스트만 가져오려면 토큰의 sub 값에 입력 되있는
        사용자의 포스트만 따로 필터링 할 수 있다. 
        특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
        5. 모든 토큰은 만료 기간이 있다. 만료기간이 지나면 새로 토큰을 발급 받아야한다.
        그렇지 않으면 jwtService.verify()에서 인증이 통과 안된다.
        그러니 access 토큰을 새로 받을 수 있는 /auth/token/access 와 
        refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요하다.
        refresh를 새로 발급받지않고 로그아웃 시켜버리는 경우도 있다. 설계에 따라서 다르고 장단점이 있다.
        6. 토큰이 만료되면 각각의 토큰을 새로 발급 받을 수 있는 엔드 포인트에 요청을 해서 새로운 토큰을 발급 받고
        새로운 토큰을 사용해서 private route 에 접근한다. 
    */


    /* 
        Header로부터 토큰을 받을 때

        {authorization: 'Basic {token}'}
        {authorization: 'Bearer {token}'}
    */
    extractTokenFromHeader(header: string, isBearer: boolean) {
    
    const splitToken = header.split(' ') // 띄어쓰기 기준으로 나눠 리스트로 반환 
    // 헤더에서 추출한 Bearer <JWT> -> [Bearer or Basic , JWT 값] 반환
    const prefix = isBearer ? 'Bearer' : 'Basic';
    
    if(splitToken.length !== 2 || splitToken[0] !== prefix ) {
        throw new UnauthorizedException('잘못된 토큰입니다.');
    }
    // 추출한 JWT 배열값이 2개가 아니라면 잘못된값 그리고 들어온 JwT값이 prefix와 동일하지않다면 잘못된값 
    // 클라이언트에서 항상 잘못된 값이 들어올수있다는 것을 항상 가정해야한다. 
    
    const token = splitToken[1];
    // 1번째 index값이 token 값이니 1번인덱스로 반환
    return token;
}

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
        secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
        expiresIn: isRefreshToken ? 3600 : 300,
    });
}
    loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        }
    }

    /*  
        첫 로그인시 accessToken 과 refresh 토큰 같이 반환
        accessToken은 refresh 토큰이 아니므로 false 
        refreshToken 은 true
        만료시 로그아웃
        refresh는 만료시간을 길게줘서 httpOnly 쿠키로 저장 
        XSS 공격방지를 위해 권장 
        서버는 클라이언트로부터 받은 refreshToken 의 서명,유효시간을 확인 할 뿐,
        별도 상태 저장하지않는다. 
        
        탈치 방지 전략
        최대한 짧은 유효시간
        Refresh 토큰 요청시 , 사용자 IP 주소 저장, 변경 여부 확인
        TLS/HTTPS 필수적 사용
        HTTP 헤더로만 확인할 수 있게(클라이언트 접근불가)
    */

    async authenticateWithEmailAndPassword(user: Pick<UsersModel , 'email' | 'password'> )  {
        /* 
            1. 사용자가 존재하는지 확인 (email)
            2. 비밀번호가 맞는지 확인
            3. 모두 통과되면 찾은 사용자 정보 반환
        */
       const existingUser = await this.usersService.getUsersByEmail(user.email);
       
       if(!existingUser) {
        throw new UnauthorizedException('존재하지 않는 사용자입니다.');
       }
       /* 
            파라미터
            1. 입력된 비밀번호
            2. 기존 해시(hash) -> 사용자 정보에 저장되있는 hash
       */
       const passOk = await bcrypt.compare(user.password, existingUser.password);
       
       if(!passOk) {
        throw new UnauthorizedException('비밀번호가 틀렸습니다.');
       }

       return existingUser;
    }
        async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
            const existingUser = await this.authenticateWithEmailAndPassword(user);

            return this.loginUser(existingUser);
        }

        async registerWithEmail(user: RegisterUserDto) {
            const hash = await bcrypt.hash(
                user.password, 
                parseInt(this.configService.get<string>(ENV_HASH_ROUNDS_KEY)),
            );

            const newUser = await this.usersService.createUser({
                ...user,
                password: hash,
            });

            return this.loginUser(newUser);
        }

        /* 
            hash(user패스워드값, 해쉬라운드 설정)
            이후 회원가입성공시 바로 로그인
        */

        decodeBasicToken(base64String: string)  {
            const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
            const split = decoded.split(':');
            
            if(split.length !== 2) {
                throw new UnauthorizedException('잘못된 유형의 토큰 입니다.')
            }

            const email = split[0];
            const password = split[1];

            return {
                email,
                password,
            }
        }

        /* 
            위의 비밀번호 관련은 임시로 간소화한 방법이며
            보통 basic을 디코딩하지않고 bcrypt.compare 를써서
            로그인 시 저장된 해시값에서 솔트를 추출, 들어온 비밀번호와 동일한 방식으로 계산
            (해싱)한 뒤, 전체 해시값을 바이트 단위로 비교
            이 과정에서 원문 비밀번호를 직접 확인하지않습니다.

            해시값은 원래 문자열이 아닌 바이너리 데이터, 문자열 비교는 시스템별 차이(예: 문자셋, 인코딩)로 문제가
            생길 수 있지만, 바이트 비교는 항상 일관된 결과를 보장한다.
            또한 , 정확성을 가질수 있다. 저장된 해시값과 새로 생성된 해시값이 완전히 동일한지 확인할 수 있다.

            비밀번호의 목적을 생각해보면 쉽다.
            비밀번호의 검증의 목적은 입력된 비밀번호가 원래의 비밀번호가 같은지 확인만 하는것
            그러므로 원문 비밀번호를 저장하거나 디코딩 할 필요가없다.

            단방향 함수-> 입력값을 출력값으로 변환은쉽다, 출력값을 입력값을 역산출하는 것은 어렵다

            단반향 함수 특성
            1. 의도적인 정보 손실:
            해싱함수는 입력데이터를 고정된 길이이 해시값으로 변환
            1기가라도해도 예로 SHA-256인경우 256비트로 고정된다. 이 과정에서 일부 데이터 정보가 손실되므로
            원본을 복원할수 없다.
            2. 비결정성
            같은 비밀번호라도 다른 솔트를 사용할 경우 완전히 다른 해시값이 생성된다.
            즉 , 출력값만으로 어떤 솔트를 사용했는지 알 수없다

            역산출의 계산 복잡도
            입력값을 알아내려면 가능한 모든 조합을 시도 해야한다 
            -> 예로 비밀번호가 8자리 일시 (대소문자, 숫자, 특문 포함) 가능한 조합은 약 6천조 이다.
            그래서 최대한 사용자에게 비밀번호를 어렵게 만들도록 유도하는것
            작은 입력값에도 큰 연산 비용
            bcrypt 게산비용을 증가시키기 위해 솔트 라운드 사용
            솔트라운드가 10일경우 , 해싱과정을 2의10제곱(1024)의 반복 계산을 수행하므로 , 역산출에 드는 비용이 매우크다

            솔트라운드는 해싱 과정에서 계산을 반복적으로 수행하는 횟수를 지정하는 값
            이값이 클수록 해싱과정이 느려지며, 보안성이 높아짐

            의도적으로 해싱작업에 더많은 계산을 요구
            비밀번호의 해싱의 시간복잡도 제어 -> 예로 10일때 걸리는 시간 1ms, 12일때 약 4ms로 증가

            반복계산의 과정은 
            1. 솔트값 생성 : bcrypt는 무작위로 생성한 솔트를 비밀번호에 추가
            2. 첫번째 해싱 : 비밀번호와 솔트를 결합하여 첫 번째 해시값을 생성
            3. 반복 해싱 : 첫버째 해싱결과를 입력값으로사용 , 총2의10제곱 번의 반복 계산을 수행
            각 반복에서 이전 단계의 해시값을 기반으로 새 해시값을 생성
            4. 최종 해시값 생성 : 2의10제곱번 반복이 완료되면, 최종 해시값을 반환, 

            솔트는 해싱과정에서 입력값(비밀번호)에 추가되는 임의의 고유데이터 
            같은 비밀번호라도 서로다른 해시값을 생성하기위해 사용
            또한 무차별 대입 공격방지 (레인보우테이블 활용)하는것을 어렵게 만듬 
            bcrypt는 솔트값을 자동으로 생성, 이값을 최종 해시에 포함 합니다.
            개발자가 별도로 솔트를 생성하거나 관리할 필요가없다.

            최종 결과에는 솔트값도 포함

            암호화하는 데이터를 인코딩하고, 키를 사용해 원본데이터를 복원할 수 있다.
            해싱은 원본 데이터를 복원할 수 없도록 설계된 단방향 함수이다.
            설계 철학 자체가 "역산출이 불가능하도록" 만든다.
        */

        verifyToken(token: string) {
            try {
                return this.jwtService.verify(token, {
                // verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;   
                /* 
                    verify는 JWT를 검증하는 함수 , 주어진 JWT토큰이 유효한지 확인, 서명을 검증하여 유효되지않거나 만료된
                    토큰에 대해 예외를 발생
                    token :string -> 검증할 jwt 문자열 
                    options? : JwtVerifyOptions -> 선택적으로 제공되는 옵션(예: 토큰 알고리즘, 발행자(issuer), 대상(audience) 등)
                    T : 토큰에 포함된 페이로드를 반환 , 페이로드는 보통 사용자 정봑 권한등을 담고있음
                */
                    secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
                });
                // jwtService의 verify 활용 
            } catch (e) {
                throw new UnauthorizedException('토큰이 만료됬거나 잘못된 토큰입니다.');
            }
        
          
        }

        rotateToken(token: string, isRefreshToken: boolean) {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
            });
        
            
        /* 
            sub: id
            email: email,
            type: 'access' | 'refresh'
        */
        if(decoded.type !== 'refresh') {
            throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다.')
        }

        return this.signToken({
            ...decoded,
        }, isRefreshToken);
    }
}

  