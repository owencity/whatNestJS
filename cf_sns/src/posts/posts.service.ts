import { BadRequestException, Injectable, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginte-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CommonService } from 'src/common/common.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HASH_ROUNDS_KEY, ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/common/const/env-keys.const';
import { join } from 'path';
import { PUBLIC_FOLDER_PATH } from 'src/common/const/path.const';
import {promises} from 'fs';


export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  }

  // let posts : PostModel[] = [
  //   {
  //     id: 1,
  //     author: 'newjeans_official',
  //     title: '뉴진스 민지',
  //     content: '메이크업 고치고 있는 민지',
  //     likeCount: 1000000,
  //     commentCount: 999999,
  //   },
  //   {
  //     id: 2,
  //     author: 'newjeans_official',
  //     title: '뉴진스 해린',
  //     content: '노래 연습하고 있는 해린',
  //     likeCount: 1000000,
  //     commentCount: 999999,
  //   },
  //   {
  //     id: 3,
  //     author: 'blackpink_official',
  //     title: '뉴진스 해린',
  //     content: '공연하고 있는 로제',
  //     likeCount: 1000000,
  //     commentCount: 999999,
  //   },
  // ];


@Injectable()
export class PostsService {

    constructor(
      @InjectRepository(PostsModel)
      private readonly postsRepository: Repository<PostsModel>,
      private readonly commonService: CommonService,
      private readonly configService: ConfigService,
    ) {
      
    }
    async getAllPosts() {
        return this.postsRepository.find({
         relations:['author']
        });
    }

  
    // 프로덕션에서 사용하는 코드 x , 올라갈때 삭제해야함 
    async generatePosts(userId: number) {
      for(let i = 0; i < 100; i++) {
        await this.createPost(userId, {
          title: `임의로 생성된 포스트 제목 ${i}`,
          content: `임의로 생성된 포스트 내용 ${i}`,
        });
      }
    }


    // 오름차순으로 정렬하는 pagination만 구현한다.
    async paginatePosts(dto: PaginatePostDto) {
    
      return this.commonService.paginate(
        dto,
        this.postsRepository,
        {
          relations: ['author'] 
        },
        'posts'
      );
    //  if(dto.page) {
    //   return this.pagePaginatePosts(dto);
    //  } else {
    //   return this.cursorPaginatePosts(dto);
    //  }
     }


    async cursorPaginatePosts(dto: PaginatePostDto) {
      const where : FindOptionsWhere<PostsModel> = {};

      if(dto.where__id__less_than) {
        where.id = LessThan(dto.where__id__less_than);
      } else if(dto.where__id__more_than) {
        where.id = MoreThan(dto.where__id__more_than);
      }

      const posts = await this.postsRepository.find({
        // 1, 2, 3, 4, 5
        where: {
          // 더크다, 더 많다
          id: MoreThan(dto.where__id__more_than ?? 0),  // ??는 null 또는 undefined를 만나면 우측값을 반환함 , null 이나 undefined일경우 기본값으로 0 사용하겠다
          // 이와 반대로 ||는 Falsy값(0, '' , false, NaN, null, undefined)를 만나면 우측 값을 반환
        },
        // order__createdAt 
        order: {
          createdAt: dto.order__createdAt,
        },
        take: dto.take,
      });
      // 해당되는 포스트가 0개 이상이면
      // 마지막 포스트를 가져오고
      // 아니면 null을 반환한다.
      const lastItem =  posts.length > 0 && posts.length === dto.take ? posts[posts.length - 1] : null;
      
      const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
      const host = this.configService.get<string>(ENV_HOST_KEY);

      const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);

      if(nextUrl) {
        /* 
          dto의 키값들을 루핑하면서 키값에 해당하는 벨류가 존재하면 param에 그대로 붙여넣는다.
          단 , where__id_more_than 값만 lastItem의 마지막 값으로 넣어준다.
        */

        for(const key of Object.keys(dto)) {
          if(dto[key]) {
            if(key !== 'where__id__more_than' && key !== 'where__id__less_than'){
              nextUrl.searchParams.append(key, dto[key]);
            }
          }
        }

        let key = null;

        if(dto.order__createdAt === 'ASC') {
          key = 'where__id__more_than';
        } else {
          key = 'where__id__less_than';
        }

        nextUrl.searchParams.append(key , lastItem.id.toString());
      }

      return {
        data: posts,
        cursor: {
          after: lastItem?.id ?? null,
        },
        count: posts.length,
        next: nextUrl?.toString() ?? null,
      }
    }
    /* 
      Response 

      data: Data[]
      cursor: {
        after: 마지막 Data의 ID
      },

      count : 응답한 데이터의 갯수
      next: 다음 요청을 할때 사용할 URL
    */

      // 페이지기반 페이지네이션
      async pagePaginatePosts(dto: PaginatePostDto) {
        const [posts, count] = await this.postsRepository.findAndCount({
          skip: dto.take * (dto.page - 1),
          take: dto.take,
          order: {
            createdAt : dto.order__createdAt,
          }
        });
        return {
          data: posts,
          total: count,
        }
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

      async createPostImage(dto: CreatePostDto) {
        // dto의 이미지 이름을 기반으로 파일의 경로를 생성한다
        const tempFilePath = join(
          PUBLIC_FOLDER_PATH,
          dto.image,
        );

        try {
          // async -> Promise를 반환하는 함수
          // fs.promises 내의 함수는 모두 Promise를 반환하며, 이를 await 키워드와 함꼐 사용할수 있습니다. (Promise 기반 비동기 API)
          await promises.access(tempFilePath);  // 파일이 존재하는지 확인, 존재하지않으면 에러를 던진다. 
        } catch (e) {
          throw new BadRequestException('존재하지 않는 파일 입니다. ');
        }
      }


    async createPost(authorId: number, postDto: CreatePostDto, ) {
      // title: string, content: 
      
      // 1) create -> 저장할 객체를 생성 
      // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)

      const post = this.postsRepository.create({
        author: {
          id: authorId,
        },
        ...postDto,
        // title,
        // content,
        likeCount:0,
        commentCount : 0,
      });
      
      const newPost = await this.postsRepository.save(post);
      return newPost;
    }

    async updatePost(postId: number, postDto : UpdatePostDto) {

      const {title, content} = postDto;
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
