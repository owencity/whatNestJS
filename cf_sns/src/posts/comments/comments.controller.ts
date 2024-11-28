import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
    /* 
      1) 엔티티 생성 
      author -> 작성자
      post -> 귀속되는 포스트
      comment -> 실제 댓글 내용
      likeCount -> 좋아요 갯수
      
      id -> PrimaryGeneratedColumn
      createdAt -> 생성일자
      updateAt -> 업데이트 일자

      2) Get() pagination
      3) Get(':commentId') 특정 comment만 하나 가져오는 기능
      4) Post() 코멘트 생성하는 기능
      5) Patch(:commentId) 특정 comment 업데이트 하는 기능
      6) DELETE(':commentId') 특정 comment 삭제하는 기능
    */  
  }

  @Get()
  pagination() {
    
  }

  @Get()
  getComment() {

  }
  
  @Post()
  postComment() {

  }

  @Patch()
  updateComment() {

  }

  @Delete()
  deleteComment() {
    
  }
}
