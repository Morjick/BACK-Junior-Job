import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';

@ApiTags('Настройки')
@Controller('settings')
export class SettingsController {
  constructor(private settingReposity: SettingsService) {}

  @Post('change-password')
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  @ApiParam({ name: 'email', type: String })
  @ApiParam({ name: 'password', type: String })
  @ApiParam({ name: 'newPassword', type: String })
  async changePassword(@Body() body, @Res() res) {
    return await this.settingReposity.changePassword(body, res);
  }
}
