import { Injectable, NotFoundException } from '@nestjs/common';

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
    getAllPosts() {
        return posts
    }

    getPostById(id: number) {
        const post = posts.find((post) => post.id === +id); // + -> 암묵적인 자바스크립트의 형변환 , +는 숫자가아닌 경우 숫자로 변환하려고 시도
        // 문자열이 변환가능한 숫자인경우 변환, 아닌경우 NaN의 결과를 냄 number(id) 와 같은 기능을한다.
        if(!post) {
          throw new NotFoundException();
        }
        return post;
    }

    createPost(author:string, title: string, content: string) {
        const post : PostModel = {
            id: posts[posts.length -1].id + 1,
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0,
          };
          posts = [
            ...posts,
            post,
          ];
          return post;
    }

    updatePost(postId: number, author: string, title: string, content: string) {
        const post = posts.find(post => post.id === postId);

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
        posts = posts.map(prevPost => prevPost.id === postId ? post: prevPost);
        return post;
    }

    deletePost(postId: number) {
        const post = posts.find((post) => post.id === postId);

    if(!post) {
      throw new NotFoundException();
    }

    posts = posts.filter(post => post.id !== postId);

    return postId;
    }
}
