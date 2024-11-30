import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { ImageModel } from 'src/common/entity/image.entity';
import { PostsImageService } from './image/images.service';
import { LogMiddleware } from 'src/common/middleware/log.middleware';
// v4버전 가장많이 사용함

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
      ImageModel,
    ]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsImageService],
  exports: [PostsService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      LogMiddleware,
    ).forRoutes({
      path: 'posts*',
      method: RequestMethod.GET
    })
  }
}
