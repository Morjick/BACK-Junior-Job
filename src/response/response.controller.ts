import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseService } from './response.service';

@ApiTags('Отклики')
@Controller('response')
export class ResponseController {
  constructor(private responseReposity: ResponseService) {}

  @Post('create')
  async create(@Body() body: any, @Headers() headers, @Res() res) {
    return await this.responseReposity.createResponse(body, headers, res);
  }

  @Get('get-many')
  async getMany(@Query() param, @Res() res) {
    return await this.responseReposity.getResponses(param, res);
  }
}
