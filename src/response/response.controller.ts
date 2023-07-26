import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResponseService } from './response.service';

@ApiTags('Отклики')
@Controller('response')
export class ResponseController {
  constructor(private responseReposity: ResponseService) {}

  @Post('create')
  @ApiParam({ name: 'targetId', type: Number })
  @ApiParam({ name: 'body', type: String })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async create(@Body() body: any, @Headers() headers, @Res() res) {
    return await this.responseReposity.createResponse(body, headers, res);
  }

  @Get('get-many')
  @ApiQuery({ name: 'targetId', type: Number })
  async getMany(@Query() param, @Res() res) {
    return await this.responseReposity.getResponses(param, res);
  }
}
