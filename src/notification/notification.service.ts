import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationRepository: typeof Notification,
  ) {}

  async create(
    type: string,
    userId: number,
    body: string,
    title?: string,
    senderId?: number,
  ) {
    return await this.notificationRepository.create({
      type,
      userId,
      body,
      title,
      senderId,
    });
  }

  async getMany(userId: number, res: any) {
    const notifications = await this.notificationRepository.findAll({
      where: { userId },
    });
    return res.status(200).json({
      message: 'Уведомления найдены',
      ok: true,
      notifications,
    });
  }

  async getUnreceived(userId: number, res: any) {
    const notifications = await this.notificationRepository.findAll({
      where: { userId, received: false },
    });

    return res.status(200).json({
      message: 'Уведомления найдены',
      ok: true,
      notifications,
    });
  }
}
