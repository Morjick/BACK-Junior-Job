import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getDocumentation(@Res() res): string {
    return res.status(200).redirect('/api');
  }
}
