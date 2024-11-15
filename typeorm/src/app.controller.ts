import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

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
       ) {

    }

    @Post('users')
    postUser() {
      return this.userRepository.save({});
    }

    @Get('users') 
    getUsers() {
      return this.userRepository.find({
        relations:{
          profile: true,
          posts: true,
        }
      });
    }

    @Patch('users/:id')
    async patchUser(
      @Param('id') id: string,
    ) {
      const user = await this.userRepository.findOne({
        where:{
          id : parseInt(id),
        }
      });

      return this.userRepository.save({
        ...user,
        // title: user.title + '0',
      });
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
        }
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
