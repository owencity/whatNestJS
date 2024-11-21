import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { query } from 'express';
import { PaginatePostDto } from './dto/paginte-post.dto';

/*
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  */

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    @User('id') userId: number, 
    @Body() body: CreatePostDto,
    // @Body('title') title:string,
    // @Body('content') content:string,
  ){
    return this.postsService.createPost(
      userId, body,
    )
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
