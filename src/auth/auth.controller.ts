import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminGuard } from '../guards/admin.guards';
import { ApiHeader, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authReposity: AuthService) {}

  @Post('sing-up')
  @ApiParam({ name: 'firstname', type: String })
  @ApiParam({ name: 'lastname', type: String })
  @ApiParam({ name: 'email', type: String })
  @ApiParam({ name: 'password', type: String })
  @ApiParam({ name: 'avatar', type: String, required: false })
  @ApiParam({ name: 'implication', type: String })
  @ApiParam({ name: 'age', type: Number })
  @ApiParam({ name: 'birsday', type: String, required: false })
  @ApiParam({ name: 'learn', type: String, required: false })
  @ApiParam({ name: 'inn', type: String, required: false })
  @ApiParam({ name: 'city', type: String, required: false })
  @ApiParam({ name: 'role', type: String, required: false })
  async singUp(@Body() body: any, @Res() res) {
    return await this.authReposity.singUp(body, res);
  }

  @Post('sing-in')
  @ApiParam({ name: 'email', type: String })
  @ApiParam({ name: 'password', type: String })
  async singIn(@Body() body, @Res() res) {
    return await this.authReposity.singIn(body, res);
  }

  @Post('check-token')
  @ApiHeader({ name: 'Authorization', description: 'Bearer token' })
  async checkToken(@Headers() headers, @Res() res) {
    return await this.authReposity.checkToken(headers, res);
  }

  @Get('get-user/:id')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'id', type: Number })
  async getUser(@Param() { id }, @Res() res) {
    return await this.authReposity.getUser(id, res);
  }

  @Get('get-many')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'lastname', type: String, required: false })
  @ApiQuery({ name: 'firstname', type: String, required: false })
  @ApiQuery({ name: 'banned', type: Boolean, required: false })
  async getMany(@Query() param, @Res() res) {
    return await this.authReposity.getMany(param, res);
  }
}
