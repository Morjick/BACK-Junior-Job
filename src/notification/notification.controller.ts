import { Controller, Get, Headers, Response } from '@nestjs/common';
import { getAutor } from '../vendor/getAutor';
import { NotificationService } from './notification.service';
import { ApiHeader } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(private notificationRepository: NotificationService) {}

  @ApiHeader({ name: 'Authorization' })
  @Get('get-many')
  async getMany(@Headers() headers, @Response() res) {
    const user = await getAutor(headers);

    return await this.notificationRepository.getMany(user.id, res);
  }

  @ApiHeader({ name: 'Authorization' })
  @Get('get-unreceived')
  async getReceived(@Headers() headers, @Response() res) {
    const user = await getAutor(headers);

    return await this.notificationRepository.getUnreceived(user.id, res);
  }
}
