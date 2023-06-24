import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VacancyService } from './vacancy.service';
import { AdminGuard } from '../guards/admin.guards';

@ApiTags('Вакансии')
@Controller('vacancy')
export class VacancyController {
  constructor(private vacancyReposity: VacancyService) {}

  @Post('create-category')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'icon', type: String })
  async createCategory(@Body() body: any, @Res() res) {
    return await this.vacancyReposity.createCategory(body, res);
  }

  @Post('create-vacancy')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'avatar', type: String })
  @ApiParam({ name: 'category', type: Number, description: 'Category id' })
  @ApiParam({ name: 'show', type: Boolean })
  async createVacancy(@Body() body: any, @Headers() headers, @Res() res) {
    return await this.vacancyReposity.createVacancy(body, headers, res);
  }

  @Put('update-vacancy/:id')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'avatar', type: String })
  @ApiParam({ name: 'category', type: Number, description: 'Category id' })
  @ApiParam({ name: 'show', type: Boolean })
  @ApiQuery({ name: 'id', type: Number })
  async updateVacancy(
    @Body() body: any,
    @Headers() headers,
    @Res() res,
    @Param() params,
  ) {
    return await this.vacancyReposity.updateVacancy(
      params.id,
      body,
      headers,
      res,
    );
  }

  @Delete('delete-category/:id')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'id', type: Number })
  async deleteArticles(@Param() params, @Res() res) {
    return await this.vacancyReposity.deleteCategory(params.id, res);
  }

  @Delete('delete-vacancy/:id')
  @ApiQuery({ name: 'id', type: Number })
  async deleteVacancy(@Param() params, @Res() res) {
    return await this.vacancyReposity.deleteVacancy(params.id, res);
  }

  @Get('get-category')
  async getCategory(@Res() res) {
    return await this.vacancyReposity.getCatygory(res);
  }

  @Get('get-many')
  @ApiQuery({
    name: 'category',
    type: Number,
    description: 'Category id',
    required: false,
  })
  async getVacancies(@Res() res, @Query() param) {
    return await this.vacancyReposity.getVacancies(param.category, res);
  }

  @Get('get-vacance/:href')
  @ApiQuery({ name: 'href', type: String })
  async getVacancy(@Res() res, @Param() param) {
    return await this.vacancyReposity.getVacancy(param.href, res);
  }
}
