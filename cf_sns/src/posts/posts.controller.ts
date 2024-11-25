import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { query } from 'express';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModelType } from 'src/common/entity/image.entity';
import { DataSource } from 'typeorm';
import { PostsImageService } from './image/images.service';

/*
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  */

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
    private readonly postsImageService: PostsImageService
  ) {}

  // 1) Get /posts
  // 모든 post를 다 가져온다.
  @Get()
  getPosts(
    @Query() query: PaginatePostDto,
  ) { 
    // return this.postsService.getAllPosts();
    return this.postsService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
  }


  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어서 id=1일 경우 id가 1인 포스트를 가져온다.
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) { // URI에서 param값은 기본적으로 string 그래서 integer 로 변환하여 받음.
   return this.postsService.getPostById(id);
  }
  // 3) Post /posts
  // POST를 생성한다.

  /* 
    Transaction 
    POST API -> A모델을 저장하고 ,B 모델을 저장한다.
    await repository.save(a);
    await repository.save(b); 
    만약 a를 저장하다가 실패하면 b를 저장하면 안될경우

    all or nothing (모두 저장되던가 아니면 실패되면 이전상태로 되돌리거나) 
    transaction의 세가지 기능
    start -> 시작 
    commit -> 저장 (쌓아뒀다가 한번에 저장)
    rollback -> 원상복구  
  */
  @Post()
  @UseGuards(AccessTokenGuard)
  async postPosts(
    @User('id') userId: number, 
    @Body() body: CreatePostDto,
    // @Body('title') title:string,
    // @Body('content') content:string,
  ){
      // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 생성한다. 
      const qr = this.dataSource.createQueryRunner();
      // 쿼리 러너에 연결한다.
      await qr.connect();
      // 쿼리 러너에서 트랜잭션을 시작한다.
      // 이 시점부터 같은 쿼리 러너를 사용하면
      // 트랜잭션 안에서 데이터베이스 액션을 실행 할 수 있다.
      await qr.startTransaction();

      // 로직 실행
      try {
        const post = await this.postsService.createPost(
          userId, body, qr,
        );
    
        for(let i = 0; i < body.images.length; i++) {
          await this.postsImageService.createPostImage({
            post,
            order : i,
            path: body.images[i],
            type: ImageModelType.POST_IMAGE,
          }, qr);
        }
        await qr.commitTransaction();
        await qr.release();

        return this.postsService.getPostById(post.id);
      } catch (e) {
        // 어떤 에러든 에러가 던져지면 트랜잭션을 종료하고 원래 상태로 되돌린다.
        await qr.rollbackTransaction();
        await qr.release();
      }
      // 
    
  }

  // 4) PUT /posts/:id
  // put 과 patch 의 차이 
  // put 은 수정할 값이 전부 존재해야하고 해당 값이 존재한다면 수정한다, 존재하지 않으면 생성해라는 메서드
  // 부분적으로 입력하고 부분적으로 수정하는 메서드는 patch 를 사용한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?:string,
    // @Body('content') content?:string,
  ) {
    return this.postsService.updatePost(
      id, body,
    );
  }

  // 5) Delete /posts/:id

  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.deletePost(id);
  }

  // id
  // @Get()
  // getPost(): PostModel {
  //   return {
  //     id: 1,
  //     author: 'newjeans_official',
  //     title: '뉴진스 민지',
  //     content: '메이크업 고치고 있는 민지',
  //     likeCount: 10000000,
  //     commentCount: 9999999,
  //   };
  // }
}
