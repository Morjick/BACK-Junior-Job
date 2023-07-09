import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { getUserByToken } from '../vendor/getUserByToken';
import { SocketModel } from './models/socket.model';

interface InitPayload {
  authorization: string;
}

interface MessagePayload {
  userId: number;
  body: string;
}

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @InjectModel(SocketModel) private socketRepository: typeof SocketModel,
    @InjectModel(Notification)
    private notificationRepository: typeof Notification,
  ) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  afterInit() {
    this.logger.log('server inited');
  }

  handleConnection() {
    this.logger.log('client connected');
  }

  async handleDisconnect(socket: any) {
    await this.socketRepository.destroy({ where: { socketId: socket.id } });

    this.logger.log('client disconnected');
  }

  private async getUserBySocket(socket: Socket) {
    return (
      await this.socketRepository.findOne({
        where: { socketId: socket.id },
      })
    ).userId;
  }

  private async getSocketsByUserId(id: number) {
    const userSockets = await this.socketRepository.findAll({
      where: { userId: id },
    });
    const sockets: Socket[] = [];

    if (!userSockets) {
      return null;
    }

    userSockets.forEach((userSocket) => {
      const socket = this.server.sockets.sockets.get(userSocket.socketId);

      if (socket != undefined) {
        sockets.push(socket);
      }
    });

    return sockets;
  }

  @SubscribeMessage('init')
  async handleInit(socket: Socket, payload: InitPayload) {
    const user = await getUserByToken(payload.authorization);

    if (!user) {
      socket.emit('error', { message: 'Необходимо передать токен' });
      socket.disconnect(true);
    }

    await this.socketRepository.create({
      userId: user.id,
      socketId: socket.id,
    });

    socket.emit('init', { ok: true });
  }

  @SubscribeMessage('message')
  async handleMessage(socket: Socket, payload: MessagePayload) {
    const senderId = await this.getUserBySocket(socket);

    const notification = await this.notificationRepository.create({
      type: 'message',
      userId: payload.userId,
      body: payload.body,
      senderId,
    });

    const userSockets = await this.getSocketsByUserId(payload.userId);

    userSockets.forEach((userSocket) => {
      userSocket.emit('message', { body: payload.body, senderId });
    });

    if (userSockets[0]) {
      await notification.update({ received: true });
    }
  }
}
