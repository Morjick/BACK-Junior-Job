import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from '../auth/auth.module';
import { SocketModel } from './models/socket.model';

@Module({
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  imports: [
    SequelizeModule.forFeature([Notification, SocketModel]),
    AuthModule,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
