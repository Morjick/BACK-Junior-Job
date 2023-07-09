import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RespondService } from './respond.service';

@ApiTags('Отклики')
@Controller('respond')
export class RespondController {
  constructor(private respondsReposity: RespondService) {}

  @Post('create/:href')
  @ApiParam({ name: 'href', type: String })
  @ApiParam({ name: 'body', type: String })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async createRespond(@Param() params, @Headers() headers, @Res() res) {
    return await this.respondsReposity.create(
      params.href,
      params.body,
      headers,
      res,
    );
  }

  @Delete('delete')
  @ApiQuery({ name: 'vacancyId', type: Number, required: true })
  @ApiQuery({ name: 'userId', type: Number, required: true })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async deleteRespond(@Query() params, @Res() res) {
    return await this.respondsReposity.deleteRespond(params, res);
  }

  @Get('get-responds-to-vacancy/:vid')
  @ApiParam({ name: 'vacancyId', type: Number })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  async getRespondsToVacancy(@Param() params, @Query() qparams, @Res() res) {
    return await this.respondsReposity.getRespondsToVacancy(
      params.vid,
      qparams,
      res,
    );
  }

  @Get('get-user-responds/:uid')
  @ApiParam({ name: 'userId', type: Number })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  async getUserResponds(@Param() params, @Query() qparams, @Res() res) {
    return await this.respondsReposity.getUserResponds(
      params.uid,
      qparams,
      res,
    );
  }
}
