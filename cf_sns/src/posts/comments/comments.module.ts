import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsService } from '../posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { count } from 'console';
import { PostExistMiddleware } from './middleware/post-exists.middleware';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentsModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(PostExistMiddleware)
    .forRoutes(CommentsController); // 경로 또는 컨트롤러 자체 입력가능 
  }
}
