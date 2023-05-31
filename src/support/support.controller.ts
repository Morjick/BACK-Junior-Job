import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupportService } from './support.service';

@ApiTags('Поддержка')
@Controller('support')
export class SupportController {
  constructor(private apealReposity: SupportService) {}

  @Post('create')
  async createApeal(@Body() body: any, @Res() res) {
    return await this.apealReposity.createApeal(body, res);
  }

  @Delete('delete')
  async deleteApeal(@Query() params, @Res() res) {
    return await this.apealReposity.deleteApeal(params.id, res);
  }

  @Get('get-many')
  async getMany(@Query() param, @Res() res) {
    return await this.apealReposity.getApeals(param, res);
  }

  @Get('get-apeal/:id')
  async getApeal(@Query() param, @Res() res) {
    return await this.apealReposity.getApeal(param, res);
  }
}
