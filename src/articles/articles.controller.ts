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
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { AdminGuard } from 'src/guards/admin.guards';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesReposity: ArticlesService) {}

  @Post('create')
  @UseGuards(AdminGuard)
  async createProduct(@Body() body: any, @Headers() headers, @Res() res) {
    return await this.articlesReposity.create(body, headers, res);
  }

  @Delete('delete-article')
  @UseGuards(AdminGuard)
  @ApiQuery({ name: 'id', type: Number })
  async deleteArticles(@Query() params, @Res() res) {
    return await this.articlesReposity.delete(params.id, res);
  }

  @Get('get-many')
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'sort', type: String })
  @ApiQuery({ name: 'title', type: String })
  async getMany(@Query() param, @Res() res) {
    return await this.articlesReposity.getMany(param, res);
  }

  @Get('get-product/:href')
  @ApiParam({ name: 'href', type: String })
  async getProduct(@Param() param, @Res() res) {
    return await this.articlesReposity.getArticle(param.href, res);
  }
}
