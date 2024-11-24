import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEy, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';

@Module({
  imports: [PostsModule,
    ServeStaticModule.forRoot({
      // 4022.   // 4022.jpg 
      // http://localhost:3000/posts/4022.jpg
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEy]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        PostsModel,
        UsersModel,
      ],
      synchronize: true,
      // synchronize 를 true로 할시 TypeORM 은 엔티티와 테이블 구조를 자동으로 동기화 한다.
      // 추가되거나 삭제되면 테이블 구조를 업데이트하거나 삭제를 자동으로 함
      // 프로덕션 환경에서는 데이터 손실 위험이 있기 때문에 false 로 진행해야한다. (JPA update, create 기능이랑 비슷)
    }),
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule {}
