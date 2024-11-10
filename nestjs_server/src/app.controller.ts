import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome() {
    return 'Home page';
  }

  @Get('post')
  getPOst() {
    return 'Post Page';
  }

  @Get('user')
  getUser() {
    return 'User Page';
  }
 }
