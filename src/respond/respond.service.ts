import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Respond } from './models/respond.model';
import { getAutor } from 'src/vendor/getAutor';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Injectable()
export class RespondService {
  constructor(
    @InjectModel(Respond) private respondReposity: typeof Respond,
    @InjectModel(Vacancy) private vacancyReposity: typeof Vacancy,
  ) {}

  async create(href, headers, res) {
    try {
      const vacancy = await this.vacancyReposity.findOne({ where: { href } });
      const { id } = await getAutor(headers);
      const vacId = vacancy.id;

      if (!vacancy) {
        return res.status(404).json({
          message: 'Вакансия не найдена',
          ok: false,
          error: '404',
        });
      }

      const respond = await this.respondReposity.create({
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
      const { uid, vid } = param;

      const respond = await this.respondReposity.findOne({
        where: { userId: uid, vacancyId: vid },
      });

      if (!respond) {
        return res.status(404).json({
          message: 'Отклик не найден',
          ok: false,
          error: '404',
        });
      }

      await this.respondReposity.destroy({
        where: { userId: uid, vacancyId: vid },
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

  async getRespondsToVacancy(vid, params, res) {
    try {
      const { limit = 50, offset = 0, sort = 'new' } = params;

      const responds = await this.respondReposity.findAll({
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

  async getUserResponds(uid, params, res) {
    try {
      const { limit = 50, offset = 0, sort = 'new' } = params;

      const responds = await this.respondReposity.findAll({
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
