import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';

interface CreateNotification {
  type: string;
  userId: number;
  body: string;
  title?: string;
}

// interface CreateMessage {
//   type: string;
//   userId: number;
//   body: string;
//   senderId?: number;
// }

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private notificationRepository: typeof Notification,
  ) {}

  async createNotification(values: CreateNotification) {
    return await this.notificationRepository.create({ values });
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

    notifications.forEach(async (notification) => {
      await notification.update({ received: true });
    });

    return res.status(200).json({
      message: 'Уведомления найдены',
      ok: true,
      notifications,
    });
  }
}
