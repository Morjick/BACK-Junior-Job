import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { addVacancytoFavorites } from './dto/addVacancyFavorites';

@ApiTags('Избранное')
@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesReposity: FavoritesService) {}

  @Post('add-vacancy')
  async addVacancy(
    @Body() dto: addVacancytoFavorites,
    @Headers() headers,
    @Res() res,
  ) {
    return await this.favoritesReposity.addVacancyToFavorites(
      dto,
      headers,
      res,
    );
  }

  @Get('get-favorites/:id')
  async getFavorites(@Param() params, @Res() res) {
    return await this.favoritesReposity.getFavorites(params.id, res);
  }
}
