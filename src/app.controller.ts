import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Main Route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDocumentation(@Res() res): string {
    return res.status(200).redirect('/api');
  }

  @Post('get-transplit')
  @ApiParam({ name: 'message', type: String })
  getTransplit(@Res() res, @Body() body) {
    return this.appService.getTransplitString(body.message, res);
  }
}
