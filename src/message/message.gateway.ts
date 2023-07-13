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
import { getUserByToken } from 'src/vendor/getUserByToken';
import { SocketModel } from './models/socket.model';
import { ApiTags } from '@nestjs/swagger';
import { Message } from './models/message.model';

interface InitPayload {
  authorization: string;
}

interface MessagePayload {
  userId: number;
  body: string;
}

interface Error {
  message: string
}

@ApiTags('Socket')
@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @InjectModel(SocketModel) private socketRepository: typeof SocketModel,
    @InjectModel(Message)
    private messageRepository: typeof Message,
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

  private sendError(socket: Socket, error: Error) {
    socket.emit('error', error)
  }

  private async getUserBySocket(socket: Socket, clientSocket: Socket) {
    const userSocket = await this.socketRepository.findOne({ where: { socketId: socket.id } })

    if(!userSocket) {
      this.sendError(clientSocket, {message: 'Пользователь не найден'})
    }

    return userSocket.userId;
  }

  private async getSocketsByUserId(id: number) {
    const userSockets = await this.socketRepository.findAll({
      where: { userId: id },
    });
    let sockets: Socket[] = [];

    userSockets.forEach((userSocket) => {
      const socket = this.server.sockets.sockets.get(userSocket.socketId);

      if (socket) {
        sockets.push(socket);
      }
    });

    return sockets;
  }

  @SubscribeMessage('init')
  async handleInit(socket: Socket, payload: InitPayload) {
    const { user } = await getUserByToken(payload.authorization);

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
    const senderId = await this.getUserBySocket(socket, socket);

    const message = await this.messageRepository.create({
      userId: payload.userId,
      body: payload.body,
      senderId,
    });

    const userSockets = await this.getSocketsByUserId(payload.userId);

    userSockets.forEach((userSocket) => {
      userSocket.emit('message', { body: payload.body, senderId });
    });

    if (userSockets[0]) {
      await message.update({ received: true });
    }
  }
}
