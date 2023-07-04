import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Respond } from './models/respond.model';
import { getAutor } from 'src/vendor/getAutor';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Injectable()
export class RespondService {
  constructor(
    @InjectModel(Respond) private respondsReposity: typeof Respond,
    @InjectModel(Vacancy) private vacancyReposity: typeof Vacancy,
  ) {}

  async create(href, headers, res) {
    try {
      const vacancy = await this.vacancyReposity.findOne({ where: href });
      const { id } = await getAutor(headers);
      const vacId = vacancy.id;

      if (!vacancy) {
        return res.status(404).json({
          message: 'Вакансия не найдена',
          ok: false,
          error: '404',
        });
      }

      const respond = await this.vacancyReposity.create({
        userId: id,
        vacancyId: vacId,
      });

      return res.status(200).json({
        message: 'Отклик успешно создан',
        ok: true,
        respond,
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

  async deleteRespond(param, res) {
    try {
      const { vid, uid } = param;
      const respond = await this.respondsReposity.findOne({
        where: { userId: uid, vacHref: vid },
      });

      if (!respond) {
        return res.status(404).json({
          message: 'Отклик не найден',
          ok: false,
          error: '404',
        });
      }

      await this.respondsReposity.destroy({
        where: { userId: uid, vacHref: vid },
      });

      return res.status(200).json({
        message: 'Отклик успещно удален',
        ok: true,
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

  async getRespondsToVacancy(params, res) {
    try {
      const { vid, limit = 50, offset = 0, sort = 'new' } = params;

      const responds = await this.respondsReposity.findAll({
        where: { vacancyId: vid },
        limit,
        offset,
        order: sort == 'new' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']],
        include: { all: true },
      });
      console.log(responds);

      const count = responds.length;
      const pages = count / limit > 1 ? Math.ceil(count) / limit : 1;
      const nextPageAvaible = pages > 1 ? true : false;

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responds,
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

  async getUserResponds(params, res) {
    try {
      const { uid, limit = 50, offset = 0, sort = 'new' } = params;

      const responds = await this.respondsReposity.findAll({
        where: { userId: uid },
        limit,
        offset,
        order: sort == 'new' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']],
        include: { all: true },
      });
      console.log(responds);

      const count = responds.length;
      const pages = count / limit > 1 ? Math.ceil(count) / limit : 1;
      const nextPageAvaible = pages > 1 ? true : false;

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responds,
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
}
