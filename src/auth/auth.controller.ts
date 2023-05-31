import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminGuard } from 'src/guards/admin.guards';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authReposity: AuthService) {}

  @Post('sing-up')
  async singUp(@Body() body: any, @Res() res) {
    return await this.authReposity.singUp(body, res);
  }

  @Post('sing-in')
  async singIn(@Body() body, @Res() res) {
    return await this.authReposity.singIn(body, res);
  }

  @Get('get-user/:id')
  @UseGuards(AdminGuard)
  async getUser(@Param() { id }, @Res() res) {
    return await this.authReposity.getUser(id, res);
  }

  @Get('get-many')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'lastname', type: String })
  @ApiQuery({ name: 'firstname', type: String })
  @ApiQuery({ name: 'banned', type: Boolean })
  async getMany(@Query() param, @Res() res) {
    return await this.authReposity.getMany(param, res);
  }
}
