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
import { AdminGuard } from '../guards/admin.guards';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesReposity: ArticlesService) {}

  @Post('create')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'title', type: String })
  @ApiParam({ name: 'body', type: String })
  @ApiParam({ name: 'avatar', type: String })
  @ApiParam({ name: 'show', type: Boolean })
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
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'title', type: String, required: false })
  async getMany(@Query() param, @Res() res) {
    return await this.articlesReposity.getMany(param, res);
  }

  @Get('get-article/:href')
  @ApiParam({ name: 'href', type: String })
  async getProduct(@Param() param, @Res() res) {
    return await this.articlesReposity.getArticle(param.href, res);
  }
}
