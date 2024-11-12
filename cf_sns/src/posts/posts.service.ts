import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  }
  let posts : PostModel[] = [
    {
      id: 1,
      author: 'newjeans_official',
      title: '뉴진스 민지',
      content: '메이크업 고치고 있는 민지',
      likeCount: 1000000,
      commentCount: 999999,
    },
    {
      id: 2,
      author: 'newjeans_official',
      title: '뉴진스 해린',
      content: '노래 연습하고 있는 해린',
      likeCount: 1000000,
      commentCount: 999999,
    },
    {
      id: 3,
      author: 'blackpink_official',
      title: '뉴진스 해린',
      content: '공연하고 있는 로제',
      likeCount: 1000000,
      commentCount: 999999,
    },
  ];


@Injectable()
export class PostsService {
    constructor(
      @InjectRepository(PostsModel)
      private readonly postsRepository: Repository<PostsModel>
    ) {
      
    }
    async getAllPosts() {
        return this.postsRepository.find();
    }

      async getPostById(id: number) {
          // const post = posts.find((post) => post.id === +id); // + -> 암묵적인 자바스크립트의 형변환 , +는 숫자가아닌 경우 숫자로 변환하려고 시도
          // 문자열이 변환가능한 숫자인경우 변환, 아닌경우 NaN의 결과를 냄 number(id) 와 같은 기능을한다.
        const post =  await this.postsRepository.findOne({  // await 를 하지않으면 에러가 잡히지않는다. promise로 반환하니 null이 아니다.
          // Promise는 비동기 작업이 완료될 때까지 상태를 유지하는 객체
          // await 사용안하면 post는 실제 데이터가아닌 Promise 객체를 가리킨다. Promise는 null 이나 undefined가 아니기 때문에 if문이 작동하지않는다.
          // 흔히 하는 실수 유의할것
            where: {
              id, // id:id -> 키값과 value 가같으면 생략 가능
            },
          });
          
          if(!post) {
            throw new NotFoundException();
          }

          return post;
      }

    async createPost(author:string, title: string, content: string) {
      // 1) create -> 저장할 객체를 생성 
      // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

      const post = this.postsRepository.create({
        author,
        title,
        content,
        likeCount:0,
        commentCount : 0,
      });
      
      const newPost = await this.postsRepository.save(post);
      return newPost;
    }

    async updatePost(postId: number, author: string, title: string, content: string) {
      // save의 기능
      // 1 만약에 데이터가 존재하지 않는다면 (id기준으로) 새로 생성한다. 
      // 2 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.
      const post = await this.postsRepository.findOne({
        where:{
          id:postId,
        }
      })

        if(!post){
          throw new NotFoundException();
        }
        if(author) {
          post.author = author;
        }
        if(title) {
          post.title = title;
        }
        if(content) { 
          post.content = content;
        }
        const newPost = await this.postsRepository.save(post);
        return newPost;
    }

    async deletePost(postId: number) {
        const post = await this.postsRepository.findOne({
          where: {
            id: postId,
          }
        })

    if(!post) {
      throw new NotFoundException();
    }
    await this.postsRepository.delete(postId);
    return postId;
    }
}
