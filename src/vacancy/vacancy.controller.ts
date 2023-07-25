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
import { AdminGuard } from 'src/guards/admin.guards';
import { SearchVacanciesDto } from './dto/vacancy.getVacancies-dto';
import { UpdateVacancyDto } from './dto/vacancy.updateVacancy-dto';
import { SetExecutorDto } from './dto/vacancy.setExecutor.dto';

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

  @Post('set-executor')
  @ApiParam({ name: 'vacancyId', type: Number })
  @ApiParam({ name: 'executorId', type: Number })
  async setExecutor(
    @Body() body: SetExecutorDto,
    @Headers() headers,
    @Res() res,
  ) {
    return await this.vacancyReposity.setExecutor(body, headers, res);
  }

  @Put('update-vacancy')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'avatar', type: String })
  @ApiParam({ name: 'category', type: Number, description: 'Category id' })
  @ApiParam({ name: 'show', type: Boolean })
  @ApiQuery({ name: 'id', type: Number })
  async updateVacancy(
    @Query() params,
    @Body() dto: UpdateVacancyDto,
    @Res() res,
  ) {
    return await this.vacancyReposity.updateVacancy(dto, params.id, res);
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

  @Get('search')
  @ApiQuery({
    name: 'sortColumn',
    type: String,
    description: 'Поле модели по которому необходимо сортировать',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    description: 'Направление сортировки',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'Количество возвращаемых вакансий',
  })
  @ApiQuery({ name: 'offset', type: String, description: 'Номер страницы' })
  @ApiQuery({ name: 'title', type: String, description: 'Поисковый запрос' })
  @ApiQuery({ name: 'category', type: String, description: 'Id категори' })
  async searchVacancies(@Res() res, @Query() query: SearchVacanciesDto) {
    return await this.vacancyReposity.searchVacancies(query, res);
  }

  @Get('get-vacance')
  @ApiQuery({ name: 'href', type: String })
  async getVacancy(@Res() res, @Query() param) {
    return await this.vacancyReposity.getVacancy(param.href, res);
  }
}
