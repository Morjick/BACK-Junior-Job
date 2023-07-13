import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Articles } from './articles.model';
import { getAutor } from 'src/vendor/getAutor';
import getTransplit from 'src/vendor/getTransplit';
import { Op } from 'sequelize';
import { CreateArticlesDto } from './dto/create-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Articles) private articlesReposity: typeof Articles,
  ) {}

  async create(data: CreateArticlesDto, headers, res) {
    try {
      const autor = await getAutor(headers);

      if (!autor.ok) {
        return res.status(autor.status).json({
          ok: false,
          message: 'Не удалось установить автора',
        });
      }

      const href = await getTransplit(data.title);

      const articles = await this.articlesReposity.create({
        ...data,
        href,
        autorId: autor.id,
      });

      return res.status(200).json({
        message: 'Статья добавлена',
        ok: true,
        articles,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async delete(id, res) {
    try {
      const article = await this.articlesReposity.findOne({ where: { id } });

      if (!article) {
        return res.status(404).json({
          message: 'Продукт не найден',
          ok: false,
          error: '404',
        });
      }

      await this.articlesReposity.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Успешно удалён',
        ok: true,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async updateArticle(id, body, res) {
    try {
      if (!id) {
        return res.status(401).json({
          message: 'Передайте в тело запроса уникальный идентификатор статьи',
          ok: false,
          error: 'BadReauest',
        });
      }
      const article = await this.articlesReposity.findByPk(id);

      if (!article) {
        return res.status(404).json({
          message: 'Продукт не найден',
          ok: false,
          error: 'NotFound',
        });
      }

      const updatedArticle = await article.update(body);

      return res.status(200).json({
        message: 'Продукт обновлён',
        ok: true,
        article: updatedArticle,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getMany(params, res) {
    try {
      const { limit = 50, offset = 0, sort = 'new', title = '' } = params;

      const articles = await this.articlesReposity.findAll({
        limit,
        offset,
        where: {
          show: true,
          title: {
            [Op.like]: `%${title}%`,
          },
        },
        order: sort == 'new' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']],
        include: { all: true },
      });
      console.log(articles);

      const count = await this.articlesReposity.count({
        where: { show: true },
      });
      const pages = count / limit > 1 ? Math.ceil(count) / limit : 1;
      const nextPageAvaible = pages > 1 ? true : false;

      return res.status(200).json({
        message: 'Статьи получены',
        ok: true,
        articles,
        pages,
        nextPageAvaible,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getArticle(href, res) {
    try {
      const article = await this.articlesReposity.findOne({
        where: { href },
        include: { all: true },
      });

      return res.status(200).json({
        message: 'Статьи получены',
        ok: true,
        article,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }
}
