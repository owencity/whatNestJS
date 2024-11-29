import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { PostsService } from '../posts.service';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createCommentDto';
import { NotFoundError } from 'rxjs';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    
    constructor(
    @InjectRepository(CommentsModel) 
    private readonly commentsRepository: Repository<CommentsModel>,
    ) {}
    
 
    // post별 댓글 조회 
    async getCommentByPostId(id: number, qr: QueryRunner) {
        const repository = this.getRepository(qr);
        const commentPost = await repository.findOne({
            where: {
                id,
            }
        });

        if(!commentPost) {
            throw new NotFoundException();
        }
        return commentPost;        
    }

    getRepository(qr? : QueryRunner) {
        return qr ? qr.manager.getRepository<CommentsModel>(CommentsModel) : this.commentsRepository;
    }

    // 댓글 작성(post에 댓글 작성 (속해야함))
    async createComment(authorId: number, commentDto: CreateCommentDto, qr?: QueryRunner) {
    
        const repository = this.getRepository(qr);
        const postComment = repository.create({
            author: {
                id : authorId,
            },
        ...commentDto, 
        // ...spread 연산자 사용이유 -> commentDto 그냥 사용시 필드명 자체로 인식 , Dto 값 전체를 펼쳐서 엔티티에 mapping
        likeCount: 0,
        });
        /* 
            repository.create() 는  DeepPartial<T> 타입을 기본적으로 요구함,
            즉 , 엔티티의 일부 속성을 선택적으로 포함하는 객체를 전달해야함
            TypeORM create() 메서드 , 타입스크립트의 타임 시스템이 데이터를 처리하는 방식 
        
            DeepPartial<T> 은 엔티티의 속성 중 일부 뽀는 전부를 선택적으로 포함할 수 있는 객체를 뜻함.
            
            TypeORM 은 엔티티의 구조와 정확히 일치하지 않는 속성을 허용하지 않음
            commentDto 라는 속성이 없어서 타입에러를 발생시킴

            TypeORM 은 관계필드와 일반필드를 구분, 관계필드는 객체로 처리하도록 설계
            엔티티에서 관계를 지정해주면 TypeORM에서 인식해서 지정해줌
        
            */

        const newPostComment = await repository.save(postComment);
        return newPostComment;
    }

    // 댓글 수정 
    async updateComment(commentId: number, postCommentDto: UpdateCommentDto ) {
        const commentPost = postCommentDto.post;
        const findCommentPost = await this.commentsRepository.findOne({
            where: {
                id: commentId
            }
        });

        if(!commentPost) {
            throw new NotFoundException();
        }

        if(commentPost) {
            findCommentPost.post = commentPost;
        }

        const newCommentPost = await this.commentsRepository.save(findCommentPost);
        return newCommentPost;
    }

    // 댓글 삭제
    async deleteComment(commentId : number) {
        const postComment = await this.commentsRepository.findOne({
            where:{ 
                id: commentId,
            }
        });

        if(!postComment) {
            throw new NotFoundException();
        }

        await this.commentsRepository.delete(commentId);
        return commentId;
    }

    


    /* 
        기능 명세 정리
        
        전체 댓글 목록
        paginate 가져올때 relation 로 댓글 가져오게 하면 끝날거같고
        댓글 하나만 조회
        findone where : id
        댓글 업데이트
        findone comment where : id 
        댓글 있는지 없는지 확인 없으면 exception 던지고
        title , content 데이터값 있으면 title, content에 넣고
        new comment 에 await 처리, 수정된 post 저장 
        new comment return 
        댓글 삭제 
        delete where : id
    
        */

}
