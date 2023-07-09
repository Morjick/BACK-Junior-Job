import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './auth.model';
import { Articles } from '../articles/articles.model';
import { Vacancy } from '../vacancy/models/vacancy.model';
import { SocketModel } from '../notification/models/socket.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [SequelizeModule.forFeature([User, Articles, Vacancy, SocketModel])],
  exports: [AuthService],
})
export class AuthModule {}
