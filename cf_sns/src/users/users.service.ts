import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { QueryRunner, Repository } from 'typeorm';
import { waitForDebugger } from 'inspector';
import { UserFollowersModel } from './entities/user-followers.entity';
import { identity, mapTo } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        @InjectRepository(UserFollowersModel)
        private readonly userFollowerRepository: Repository<UserFollowersModel>,
    ) {}

    getUsersRepository(qr? : QueryRunner) {
        return qr? qr.manager.getRepository<UsersModel>(UsersModel) : this.usersRepository;
    }

    getUserFollowRepository(qr? : QueryRunner) {
        return qr ? qr.manager.getRepository<UserFollowersModel>(UserFollowersModel) : this.userFollowerRepository;
    }

    async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
        // 닉네임 중복이 없는지 확인
        // exist() -> 조건에 해당되는 값이 있으면 true 
        const nicknameExists = await this.usersRepository.exists({
            where:{
                nickname : user.nickname,
            }
        });

        if(nicknameExists) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.')
        }

        const emailExists = await this.usersRepository.exists({
            where: {
                email: user.email,
            }
        });

        if(emailExists) {
            throw new BadRequestException('이미 존재하는 이메일 입니다.')
        }
        
        const userObject = this.usersRepository.create({
            nickname : user.nickname,
            email: user.email,
            password: user.password,
        });

        const newUser = await this.usersRepository.save(userObject);

        return newUser;

        /* 
        await는 비동기 코드의 결과를 기다리기 위해 사용하는 구문, 비동기 처리와 동시 처리를 어떻게 구성하느냐에 따라 동작이 달라짐
        await는 각 비동기 작업이 완료될때까지 순차적으로 기다림
        모든 작업이 반드시 순차적으로 실행되어야 하는 것은 아님 
        병렬 -> Promise.all 사용(단점: 개별에러 체크 불가)
        */
    }

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async getUsersByEmail(email : string) {
        return this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }

    async followerUser(followerId : number, followeeId: number, qr?: QueryRunner) {

        const userFollowersRepository = this.getUserFollowRepository(qr);

         await userFollowersRepository.save({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            }
        });
        return true;
    }
    /* 
        [
            {
                id:number;
                follower: UsersModel;
                followee: UsersModel;
                isConfirmed: boolean;

            }
        ]
    */
   

    async getFollowers(userId: number, includeNotConfirmed: boolean) {
        const where = {
            followee: {
                id: userId,
            },
        };

        if(includeNotConfirmed) {
            where['isConfirmed'] = true;
        }
        
        const result = await this.userFollowerRepository.find({
            where ,
            relations: {
                follower: true,
                followee: true,
            }
        });
        return result.map((x) => ({
            id: x.follower.id,
            nickname: x.follower.nickname,
            isConfirmed: x.isConfirmed,
        }));
    }

    async confirmFollow(followerId: number, followeeId: number, qr? : QueryRunner) {

        const userFollowersRepository = this.getUserFollowRepository(qr);
        const existing = await userFollowersRepository.findOne({
            where: {
                follower: {
                    id: followerId,
                },
                followee : {
                    id: followeeId,
                }
            },
            relations: {
                follower: true,
                followee: true,
            }
        });

        if(!existing) {
            throw new BadRequestException(
                '존재하지 않는 팔로우입니다.'
            );
        }

        await userFollowersRepository.save({
            ...existing,
            isConfirmed: true,
        });

        return true;
    }

    async deleteFollow(
        followerId: number,
        followeeId: number,
        qr? : QueryRunner,
    ) { 
        const userFollowersRepository = this.getUserFollowRepository(qr);
        await userFollowersRepository.delete({
            follower: {
                id: followerId,
            },
            followee: {
                id: followeeId,
            },
        });
        return true;
    }

    async incrementFollowerCount(userId: number, qr?: QueryRunner) {
        const usersRepository = await this.getUsersRepository(qr);

        await usersRepository.increment({
            id: userId,
        }, 'followerCount', 1);
    }

    async decrementFollowerCount(userId: number, qr?: QueryRunner) {
        const usersRepository = await this.getUsersRepository(qr);

        await usersRepository.decrement({
            id: userId, 
        }, 'followerCount', 1)
    }
}
