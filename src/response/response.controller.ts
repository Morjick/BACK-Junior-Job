import {
  Body,
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
import { ResponseService } from './response.service';

@ApiTags('Отклики')
@Controller('response')
export class ResponseController {
  constructor(private responseReposity: ResponseService) {}

  @Post('create/:href')
  @ApiParam({ name: 'href', type: Number })
  @ApiParam({ name: 'body', type: String })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async create(
    @Body() body: any,
    @Param() param,
    @Headers() headers,
    @Res() res,
  ) {
    return await this.responseReposity.createResponse(
      param.href,
      body,
      headers,
      res,
    );
  }

  @Delete('delete')
  @ApiQuery({ name: 'vacancyId', type: Number, required: true })
  @ApiQuery({ name: 'autorId', type: Number, required: true })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async deleteRespond(@Query() params, @Res() res) {
    return await this.responseReposity.deleteResponse(params, res);
  }

  @Get('get-responses-to-vacancy/:vacancyId')
  @ApiParam({ name: 'vacancyId', type: Number })
  async getRespondsToVacancy(@Param() params, @Res() res) {
    return await this.responseReposity.getResponsesToVacancy(
      params.vacancyId,
      res,
    );
  }

  @Get('get-user-responses/:autorId')
  @ApiParam({ name: 'userId', type: Number })
  async getUserResponds(@Param() params, @Res() res) {
    return await this.responseReposity.getUserResponses(params.autorId, res);
  }
}
