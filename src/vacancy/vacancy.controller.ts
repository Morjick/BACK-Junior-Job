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
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { VacancyService } from './vacancy.service';
import { AdminGuard } from 'src/guards/admin.guards';

@ApiTags('Вакансии')
@Controller('vacancy')
export class VacancyController {
  constructor(private vacancyReposity: VacancyService) {}

  @Post('create-category')
  @UseGuards(AdminGuard)
  async createCategory(@Body() body: any, @Res() res) {
    return await this.vacancyReposity.createCategory(body, res);
  }

  @Post('create-vacancy')
  @UseGuards(AdminGuard)
  async createVacancy(@Body() body: any, @Headers() headers, @Res() res) {
    return await this.vacancyReposity.createVacancy(body, headers, res);
  }

  @Delete('delete-category')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'id', type: Number })
  async deleteArticles(@Query() params, @Res() res) {
    return await this.vacancyReposity.deleteCategory(params.id, res);
  }

  @Delete('delete-vacancy')
  @ApiQuery({ name: 'id', type: Number })
  async deleteVacancy(@Query() params, @Res() res) {
    return await this.vacancyReposity.deleteVacancy(params.id, res);
  }

  @Get('get-category')
  async getCategory(@Res() res) {
    return await this.vacancyReposity.getCatygory(res);
  }

  @Get('get-many')
  async getVacancies(@Res() res, @Query() param) {
    return await this.vacancyReposity.getVacancies(param.category, res);
  }

  @Get('get-vacance/:href')
  async getVacancy(@Res() res, @Param() param) {
    return await this.vacancyReposity.getVacancy(param.href, res);
  }
}
