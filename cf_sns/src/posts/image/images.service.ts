import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageModel } from "src/common/entity/image.entity";
import { QueryRunner, Repository } from "typeorm";
import { CreatePostDto } from "../dto/create-post.dto";
import { CreatePostImageDto } from "./dto/create-image.dto";
import { basename, join } from "path";
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from "src/common/const/path.const";
import { promises } from "fs";


@Injectable()
export class PostsImageService {
    constructor(
        @InjectRepository(ImageModel)
        private readonly imageRepository: Repository<ImageModel>,
    ) {

    }

        getRepository(qr? : QueryRunner) {
            return qr ? qr.manager.getRepository<ImageModel>(ImageModel) : this.imageRepository;
               }

        async createPostImage(dto: CreatePostImageDto, qr? : QueryRunner) {

            const repository = this.getRepository(qr);
             // dto의 이미지 이름을 기반으로 파일의 경로를 생성한다
        const tempFilePath = join(
            TEMP_FOLDER_PATH,
            dto.path,
          );
  
          try {
            // async -> Promise를 반환하는 함수
            // fs.promises 내의 함수는 모두 Promise를 반환하며, 이를 await 키워드와 함꼐 사용할수 있습니다. (Promise 기반 비동기 API)
            await promises.access(tempFilePath);  // 파일이 존재하는지 확인, 존재하지않으면 에러를 던진다. 
          } catch (e) {
            throw new BadRequestException('존재하지 않는 파일 입니다. ');
          }
  
          // 파일 이름만 가져오기 
          const fileName = basename(tempFilePath); // 파일이름만 추출. 
  
          // 새로 이동할 포스트 폴더의 경로 + 이미지 이름
          const newPath = join(
            POST_IMAGE_PATH,
            fileName,
          );
          // save
          const result = await repository.save({
            ...dto,
          })
  
          // 파일 옮기기
          await promises.rename(tempFilePath, newPath);
  
          
  
          return result;
        }
    }
