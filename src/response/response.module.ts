import { Module } from '@nestjs/common';
import { ResponseController } from './response.controller';
import { ResponseService } from './response.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseModel } from './models/response.model';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService],
  imports: [SequelizeModule.forFeature([ResponseModel]), NotificationModule],
})
export class ResponseModule {}
