import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { DataSource, QueryRunner as QR} from 'typeorm';
import { PostsImageService } from './image/images.service';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';

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
    // @UseInterceptors(LogInterceptor)
  // @UseFilters(HttpExceptionFilter)
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
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number, 
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
    // @Body('title') title:string,
    // @Body('content') content:string,
  ){  
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
        return this.postsService.getPostById(post.id, qr);
      }
      /* 
        일반적인 REST 관례
        POST요청은 리소스를 생성하는 작업
        성공적으로 생성된 리소스의 정보를 반환하는 것이 일반적. 특히, 생성된 리소스의 id를 반환하는 경우가 많다.
        클라이언트가 생성된 게시글의 상세정보를 바로 확인할 수 있도록 하기 위함(다시 데이터를 요청할 필요가없음)

        프론트측에서의 이점
        UI/UX 향상 
        클라이언트 측에서는 작성한 게시글을 화면에 바로 렌더링하는 경우가 많음 
        작성 후 바로 상세 페이지로 이동하거나, 작성된 내용을 바로 보여주는 UX를 제공하기 위해 서버에서 작성된 데이터의 세부정보를 반환하는 방식

        기능 명세와 프로젝트 요구사항에 따라 결정되지만 일반적인 관례에서는 작성된 리소스의 일부 또는 전체 정보를 반환하는 것이 흔하다.
      */

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
