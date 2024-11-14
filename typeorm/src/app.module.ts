import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';
import { AirplaneModel, BookModel, CarModel, ComputerModel, SingleBaseModel } from './entity/inheritance.entity';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';

@Module({
  imports: [
    // TypeOrm 만의 기능 forFeature 와 forRoot 
    TypeOrmModule.forFeature([ // 모듈에서 사용할 엔티티 등록 , 엔티티의 repository주입을 가능하게함. [] 여러개 엔티티(목록명) 사용위한 배열 사용
      UserModel, // 단순히 리포지터리 주입하기 위해 사용 
      ProfileModel,
      PostModel,
    ]),
    TypeOrmModule.forRoot({ //데이터베이스 연결 설정, 앱 전체에 적용 , 한번만 호출 , 데이터베이스는 각 속성이 명확히 구분되어야하므로 {} 객체로 사용
      type: 'postgres',
      host: '127.0.0.1',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [
        UserModel,
        StudentModel,
        TeacherModel,
        BookModel,
        CarModel,
        SingleBaseModel,
        ComputerModel,
        AirplaneModel,
        ProfileModel,
        PostModel,
      ], // 여러 엔티티가 포함될수 있으므로, 엔티티 "목록"을 의미하는 배열로 설정 ,  
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
