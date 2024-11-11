import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';

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
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어서 id=1일 경우 id가 1인 포스트를 가져온다.
  @Get(':id')
  getPost(@Param('id') id: string) {
   return this.postsService.getPostById(+id);
  }
  // 3) Post /posts
  // POST를 생성한다.
  @Post()
  postPosts(
    @Body('author') author:string,
    @Body('title') title:string,
    @Body('content') content:string,
  ){
    return this.postsService.createPost(
      author, title, content
    )
  }

  // 4) PUT /posts/:id
  @Put(':id')
  putPost(
    @Param('id') id:string,
    @Body('author') author?:string,
    @Body('title') title?:string,
    @Body('content') content?:string,
  ) {
    return this.postsService.updatePost(
      +id, author, title, content,
    );
  }

  // 5) Delete /posts/:id

  @Delete(':id')
  deletePost(
    @Param('id') id: string,
  ) {
    return this.postsService.deletePost(+id);
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
