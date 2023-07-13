import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationService],
  controllers: [NotificationController],
  imports: [
    SequelizeModule.forFeature([Notification]),
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
