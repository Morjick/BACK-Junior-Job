import { Module } from '@nestjs/common';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { VacancyCategory } from './models/category.model';
import { Vacancy } from './models/vacancy.model';
import { User } from 'src/auth/auth.model';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/response/response.service';
import { NotificationService } from 'src/notification/notification.service';
import { ResponseModel } from 'src/response/models/response.model';
import { Notification } from 'src/notification/models/notification.model';

@Module({
  controllers: [VacancyController],
  providers: [
    VacancyService,
    AuthService,
    JwtService,
    ResponseService,
    NotificationService,
  ],
  imports: [
    SequelizeModule.forFeature([
      VacancyCategory,
      Vacancy,
      User,
      ResponseModel,
      Notification,
    ]),
  ],
})
export class VacancyModule {}
