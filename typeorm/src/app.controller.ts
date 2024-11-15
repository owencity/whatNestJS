import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  UserModel } from './entity/user.entity';
import { Between, Equal, ILike, In, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';
import { equal } from 'assert';

@Controller()
export class AppController {
    constructor(
      @InjectRepository(UserModel) 
      private readonly userRepository: Repository<UserModel>,
      @InjectRepository(ProfileModel) 
      private readonly profileRepository: Repository<ProfileModel>,    
      @InjectRepository(PostModel) 
      private readonly postRepository: Repository<PostModel>,
      @InjectRepository(TagModel)
      private readonly tagRepository: Repository<TagModel>,
       ) { }

       @Post('sample')
       async sample() {
        // 모델에 해당되는 객체 생성 - 저장은 안함
        // const user1 = this.userRepository.create({
        //   email: 'test@naver.com',
        // });

        // 저장
        // const user2 = await this.userRepository.save( {
        //   email : 'test@naver.com'
        // });

        // preload
        // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
        // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
        // 저장하지는 않음
        // const user3 = await this.userRepository.preload({
        //   id: 101,
        //   email: 'factoto@naver.com',
        // });

        // 삭제하기
        // await this.userRepository.delete(
        //   101,
        // );

        await this.userRepository.increment({
          id: 1,
        }, 'count', 2);
       }

    @Post('users')
    async postUser() {
      for(let i = 0; i < 100; i++){
        await this.userRepository.save({
          email: `user-${i}@google.com`,
        });
      }
    }

    @Get('users') 
    getUsers() {
      return this.userRepository.find({
        where : {
          // 아닌경우 가져오기
          // id: Not(1),
          // 적은경우 가져오기(미만)
          // id: LessThan(30),
          // 적은경우 or 같은 경우 (이하)
          // id: LessThanOrEqual(30),
          // 많은 경우(초과)
          // id: MoreThan(30),
          // 많거나 같은경우 (이상)
          // id: MoreThanOrEqual(30)
          // 같은 경우
          // id: Equal(30),
          // 유사값 가져오기
          // email: Like('%0%'),
          // 대문자 소문자 구분안하는 유사값
          // email: ILike('%GOOGLE%'),
          // 사이 값
          // id: Between(10, 15),
          // 해당되는 여러개의 값
          // id: In([3, 5, 6, 8]), // List 로 In 값 구할수 있음
          id: IsNull(),

        },
        // 어떤 프로퍼티를 선택할지
        // 기본은 모든 프로퍼티를 가져온다
        // 만약에 select를 정의하지 않으면
        // select를 정의하면 정이된 프로퍼티들만 가져오게된다.
        // select:{
        //   // 아무값도 넣지않으면 모든 값 을 가져옴
        //   // 하나라도 입력하면 하나의값만 가져옴
        //   id: true,
        //   version: true,
        // },
        // 필터링할 조건을 입력하게 된다.
        // where: {
        //   version: 1,
        //   id: 3,
        // },
      });
    }

    @Patch('users/:id')
    async patchUser(
      @Param('id') id: string,
    ) {
      const user = await this.userRepository.findOne({
        where:{
          id : parseInt(id),
        },

        // 관계를 가져오는법
        relations: {
          profile: true,
        },
        // 오름차 ASC  내림차순 DESC
        order: {
          id: 'ASC',
        },
        
        
      });

      return this.userRepository.save({
        ...user,
        // title: user.title + '0',
      });
    }
    
    @Delete('user/profile/:id')
    async deleteProfile (
      @Param('id') id: string,
    ) {
      await this.profileRepository.delete(+id);
    }


    @Post('user/profile')
    async createUserAndProfile() {
      const user = await this.userRepository.save({
        email: 'asdf@naver.com',
      });
      const profile = await this.profileRepository.save({
        profileImg: 'asdf.jpg',
        user,
      });

      return user;
    }

    @Post('user/post')
    async createUserAndPosts() {
      const user = await this.userRepository.save({
        email: 'sad@naver.com'
      });

      await this.postRepository.save({
        author: user,
        title: 'post 1',
      });

      await this.postRepository.save({
        author: user,
        title: 'post 2',
      });

      return user;
    }

    @Post('posts/tags')
    async createPostsTags() {
      const post1 = await this.postRepository.save({
        title: 'nestjs',
      });
      const post2 = await this.postRepository.save({
        title: 'programming',
      });
      const tag1 = await this.tagRepository.save({
        name: 'javascript',
        posts:[post1, post2] 
      });

      const tag2 = await this.tagRepository.save({
        name: 'TypeScript',
        posts: [post1] 
      });

      const post3 = await this.postRepository.save({
        title: 'NextJs Lecture',
        tags: [tag1 , tag2],
      });

      return true;
    }

    @Get('posts')
    getPosts() {
      return this.postRepository.find({
        relations:{
          tags: true,
        },
        // 처음 몇개를 제외할지,
        skip: 0, // 정렬 한후 처음 몇개를 제외할지 정함
        take: 0, // 기본값 0 데이터 전부 가져옴 , 정렬 후 처음부터 몇개를 가져올지 정함 
      });
    }

    @Get('tags')
    getTags() {
      return this.tagRepository.find({
        relations:{
          posts: true,
        }
      });
    }
}
