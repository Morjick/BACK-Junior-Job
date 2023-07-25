import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VacancyCategory } from './models/category.model';
import getTransplit from 'src/vendor/getTransplit';
import { getAutor } from 'src/vendor/getAutor';
import { Vacancy } from './models/vacancy.model';
import { Op } from 'sequelize';
import { SetExecutorDto } from './dto/vacancy.setExecutor.dto';
import { User } from 'src/auth/auth.model';
import { ResponseModel } from 'src/response/models/response.model';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy)
    private vacancyReposity: typeof Vacancy,
    @InjectModel(VacancyCategory)
    private vacancyCategoryReposity: typeof VacancyCategory,
    @InjectModel(User)
    private userReposity: typeof User,
    @InjectModel(ResponseModel)
    private responseReposity: typeof ResponseModel,
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
      await this.vacancyReposity.destroy({ where: { categoryId: id } });
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

  async updateVacancy(dto, vacancyId, res) {
    try {
      const vacancy = await this.vacancyReposity.findByPk(vacancyId);
      await vacancy.update(dto);

      return res.status(200).json({
        message: 'Успешно создана',
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
      const vacancy = await this.vacancyReposity.findOne({
        where: { href },
        include: { all: true },
      });

      const reseponses = await this.responseReposity.findAll({
        where: { id: vacancy.id },
      });

      return res.status(200).json({
        message: 'Категории найдены',
        ok: true,
        vacancy,
        reseponses,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getVacancies(category, res) {
    try {
      let vacancy = [];
      if (category) {
        vacancy = await this.vacancyReposity.findAll({
          where: { categoryId: category },
          include: { all: true },
        });
      } else {
        vacancy = await this.vacancyReposity.findAll({
          include: { all: true },
        });
      }

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

  async searchVacancies(query: any, res: any) {
    try {
      const {
        sortColumn = 'createdAt',
        sortBy = 'ASC',
        limit = 50,
        offset = 0,
        title = '',
        category = null,
      } = query;
      const vacancies = await this.vacancyReposity.findAll({
        limit,
        offset,
        where: category
          ? { categoryId: category, title: { [Op.like]: `%${title}%` } }
          : { title: { [Op.like]: `%${title}%` } },
        order: [[sortColumn, sortBy]],
        include: { all: true },
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

  async setExecutor(body: SetExecutorDto, headers, res) {
    try {
      const autor = await getAutor(headers);

      const vacancy = await this.vacancyReposity.findOne({
        where: { id: body.vacancyId },
      });

      if (autor.id !== vacancy.autorId) {
        return res.status(301).json({
          message: 'Вы можете выбирать пользователя только на свою вакансию',
          ok: false,
          error: 'NotImplimintation',
        });
      }

      const executor = await this.userReposity.findOne({
        where: { id: body.executorId },
      });

      vacancy.set('executorId', executor.id);
      vacancy.set('open', false);

      return res.status(200).json({
        message: 'Испольнитель выбран',
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
}
