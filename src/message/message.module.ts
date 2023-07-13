import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { SocketModel } from './models/socket.model';
import { User } from 'src/auth/auth.model';
import { AuthModule } from 'src/auth/auth.module';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, SocketModel, User]),
    AuthModule,
  ],
  providers: [MessageGateway, MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
