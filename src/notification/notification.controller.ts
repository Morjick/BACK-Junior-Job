import { Controller, Get, Headers, Response } from '@nestjs/common';
import { getAutor } from 'src/vendor/getAutor';
import { NotificationService } from './notification.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Уведомления')
@Controller('notification')
export class NotificationController {
  constructor(private notificationRepository: NotificationService) {}

  @ApiHeader({ name: 'Authorization' })
  @Get('get-many')
  async getMany(@Headers() headers, @Response() res) {
    const user = await getAutor(headers);

    return await this.notificationRepository.getMany(user.id, res);
  }
}
