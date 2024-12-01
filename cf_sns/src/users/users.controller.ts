import { Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './entities/const/roles.const';
import { UsersModel } from './entities/users.entity';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() 
  @Roles(RolesEnum.ADMIN)
  // @UseInterceptors(ClassSerializerInterceptor)
  /* 
    serialization -> 직렬화 -> 현재 시스템에서 사용되는 (NestJS) 데이터의 구조를 다른 시스템에서도 쉽게 사용 할 수 있는 포멧으로 변환
    -> class의 object에서 JSON 포멧으로 변환

    deserialization -> 역직렬화 
  */
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(
    @User() user: UsersModel,
    @Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe) includeNotConfirmed: boolean 
  ) {
    return this.usersService.getFollowers(user.id, includeNotConfirmed);
  }

  // @Post()
  // postUser(@Body('nickname') nickname: string,
  // @Body('email') email: string,
  // @Body('password') password: string) {
  //   return this.usersService.createUser({
  //     nickname,
  //     email,
  //     password,
  //   });
  // }

  // 테스트용 API 지워놓는 습관을 들여야한다.
  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followerUser(
      user.id,
      followeeId,
    );
    return true;
  }

  @Patch('follow/:id/confirm')
  async patchFollowConfirm(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followerId: number,
    
  ) {
    await this.usersService.confirmFollow(followerId, user.id);
    return true;
  }

  @Delete('follow/:id')
  async deleteFollow 
  (
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ){
    await this.usersService.deleteFollow(
      user.id,
      followeeId,
    );

    return true;
  }
}
