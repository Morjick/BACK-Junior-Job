import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModel } from './models/response.model';
import { NotificationModule } from 'src/notification/notification.module';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService],
  imports: [
    SequelizeModule.forFeature([ResponseModel, Vacancy]),
    NotificationModule,
  ],
})
export class ResponseModule {}
