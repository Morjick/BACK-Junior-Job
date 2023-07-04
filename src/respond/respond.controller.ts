import {
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RespondService } from './respond.service';

@ApiTags('Отклики')
@Controller('responds')
export class RespondController {
  constructor(private respondsReposity: RespondService) {}

  @Post('create')
  // @ApiQuery({ name: 'href', type: String })
  @ApiParam({ name: 'href', type: String })
  async createRespond(@Query() params, @Headers() headers, @Res() res) {
    return await this.respondsReposity.create(params.href, headers, res);
  }

  @Delete('delete')
  @ApiQuery({ name: 'vid', type: Number })
  @ApiQuery({ name: 'uid', type: Number })
  async deleteRespond(@Query() params, @Res() res) {
    return await this.respondsReposity.deleteRespond(params, res);
  }

  @Get('get-responds-to-vacancy')
  @ApiQuery({ name: 'vid', type: Number })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  async getRespondsToVacancy(@Query() params, @Res() res) {
    return await this.respondsReposity.getRespondsToVacancy(params, res);
  }

  @Get('get-user-responds')
  @ApiQuery({ name: 'uid', type: Number })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  async getUserResponds(@Query() params, @Res() res) {
    return await this.respondsReposity.getUserResponds(params, res);
  }
}
