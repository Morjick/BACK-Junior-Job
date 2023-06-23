import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VacancyCategory } from './models/category.model';
import getTransplit from 'src/vendor/getTransplit';
import { getAutor } from 'src/vendor/getAutor';
import { Vacancy } from './models/vacancy.model';
import { Op } from 'sequelize';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(VacancyCategory)
    private vacancyCategoryReposity: typeof VacancyCategory,
    @InjectModel(Vacancy)
    private vacancyReposity: typeof Vacancy,
  ) {}

  async createCategory(body, res) {
    try {
      const isAlreadyTitle = await this.vacancyCategoryReposity.findOne({
        where: { title: body.title },
      });

      if (isAlreadyTitle) {
        return res.status(401).json({
          ok: false,
          message: 'Категория с таким названием уже существует',
        });
      }

      const hash = await getTransplit(body.title);

      const category = await this.vacancyCategoryReposity.create({
        ...body,
        hash,
      });

      return res.status(200).json({
        message: 'Категория успешно создана',
        ok: true,
        category,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async deleteCategory(id, res) {
    try {
      await this.vacancyCategoryReposity.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Категория удалена',
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

  async createVacancy(body, headers, res) {
    try {
      const { id } = await getAutor(headers);

      const isAlreadyCategory = await this.vacancyCategoryReposity.findOne({
        where: { id: body.category },
      });

      if (!isAlreadyCategory) {
        return res.status(301).json({
          message: 'Укажите, пожалуйста, категорию вакансии',
          ok: false,
        });
      }

      const href = await getTransplit(body.title);

      const vacancy = await this.vacancyReposity.create({
        ...body,
        categoryId: isAlreadyCategory.id,
        autorId: id,
        show: true,
        href,
      });

      return res.status(200).json({
        message: 'Успешно создана',
        ok: true,
        vacancy,
      });
    } catch (e) {
      console.log(e);
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async deleteVacancy(id, res) {
    try {
      await this.vacancyReposity.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Вакансия удалена',
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

  async getCatygory(res) {
    try {
      const category = await this.vacancyCategoryReposity.findAll();

      return res.status(200).json({
        message: 'Категории найдены',
        ok: true,
        category,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getVacancy(href, res) {
    try {
      const vacancy = await this.vacancyReposity.findOne({ where: { href } });

      return res.status(200).json({
        message: 'Категории найдены',
        ok: true,
        vacancy,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getVacancies(query: any, res: any) {
    try {
      const {
        sortColumn = 'createdAt',
        sortBy = 'ASC',
        limit = 50,
        offset = 0,
        title = '',
        categoryId = null,
      } = query;
      const vacancies = await this.vacancyReposity.findAll({
        limit,
        offset,
        where: categoryId
          ? { categoryId, title: { [Op.like]: `%${title}%` } }
          : { title: { [Op.like]: `%${title}%` } },
        order: [[sortColumn, sortBy]],
      });

      return res.status(200).json({
        message: 'Вакансии найдены',
        ok: true,
        vacancies,
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
