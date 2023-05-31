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
import { SettingsService } from './settings.service';

@ApiTags('Настройки')
@Controller('settings')
export class SettingsController {
  constructor(private settingReposity: SettingsService) {}

  @Post('change-password')
  async changePassword(@Body() body, @Headers() Headers, @Res() res) {
    return await this.settingReposity.changePassword(body, res);
  }
}
