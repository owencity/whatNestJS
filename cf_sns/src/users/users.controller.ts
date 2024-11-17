import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() 
  getUsers() {
    return this.usersService.getAllUsers();
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
}
