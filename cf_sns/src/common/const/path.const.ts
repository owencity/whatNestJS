import {resolve, join } from "path";

// 폴더하나에서 여러개 관리하고있어 커스텀 path 로 
const customPath = '../cf_sns';
process.chdir(resolve(process.cwd(), customPath));

// 서버 프로젝트의 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();


// 외부에서 접근 가능한 파일들을 모아놓은 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// 포스트 이미지들을 저장할 폴더 이름
export const POSTS_FOLDER_NAME = 'posts';

// 실재 공개 폴더의 절대 경로
// /{프로젝트 위치}/public
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH, 
    PUBLIC_FOLDER_NAME,
)

// 포스트 이미지를 저장할 폴더
// /{프로젝트 위치}/public/posts
export const POST_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    POSTS_FOLDER_NAME,
)

// 절대경로 x
// /public/posts/xxx.jpg
export const POST_PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    POSTS_FOLDER_NAME,
)