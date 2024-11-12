import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';

@Module({
  imports: [PostsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        PostsModel,
      ],
      synchronize: true,
      // synchronize 를 true로 할시 TypeORM 은 엔티티와 테이블 구조를 자동으로 동기화 한다.
      // 추가되거나 삭제되면 테이블 구조를 업데이트하거나 삭제를 자동으로 함
      // 프로덕션 환경에서는 데이터 손실 위험이 있기 때문에 false 로 진행해야한다. (JPA update, create 기능이랑 비슷)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
