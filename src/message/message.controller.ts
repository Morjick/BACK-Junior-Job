import {
  Controller,
  Get,
  Headers,
  Query,
  Response,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { getAutor } from 'src/vendor/getAutor';
import { GetMessageDto } from './dto/message.get-dto';

@ApiTags('Сообщения')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiHeader({ name: 'Authorization' })
  @ApiParam({ name: 'senderId' })
  @Get('get-many')
  async getMany(
    @Response() res,
    @Headers() headers,
    @Query() param: GetMessageDto,
  ) {
    const autor = await getAutor(headers);

    return await this.messageService.getMany(res, autor.id, param);
  }
}
