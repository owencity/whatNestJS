import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { CreateCommentsDto } from './dto/createCommentsDto';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR} from 'typeorm';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { UsersModel } from 'src/users/entities/users.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
    /* 
      모듈, 리포티터리 설정 유의할것

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
  getComments(
    @Param('postId', ParseIntPipe) postId: number, 
    @Query() query: PaginateCommentsDto,
  ) {
    return this.commentsService.paginateComments(
      query,
      postId,
    );
  }

  @Get(':commentId')
  getComment(
    @Param('commentId', ParseIntPipe) commentId : number,
  ) {
    return this.commentsService.getCommentById(commentId);
  }

  
  
  @Post()
  @UseGuards(AccessTokenGuard)
  // @UseInterceptors(TransactionInterceptor)
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentsDto,
    @User() user: UsersModel,
    // @QueryRunner() qr: QR,
  ) {
    return this.commentsService.createComment(
      body,
      postId,
      user,
    );
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number, 
    @Body() body: UpdateCommentsDto
  ) {
   return this.commentsService.updateComment(
    commentId,
    body,
   )
  }
  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.commentsService.deleteComment(commentId);
  }
}

