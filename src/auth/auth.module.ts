import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './auth.model';
import { Articles } from 'src/articles/articles.model';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  imports: [SequelizeModule.forFeature([User, Articles, Vacancy])],
  exports: [AuthService],
})
export class AuthModule {}
