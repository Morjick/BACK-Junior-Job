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

  async create(href, body, headers, res) {
    try {
      const vacancy = await this.vacancyReposity.findOne({ where: { href } });
      const { id } = await getAutor(headers);

      if (!vacancy) {
        return res.status(404).json({
          message: 'Вакансия не найдена',
          ok: false,
          error: '404',
        });
      }

      const respond = await this.respondReposity.create({
        userId: id,
        body,
        vacancyId: vacancy.id,
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
      const { userId, vacancyId } = param;

      const respond = await this.respondReposity.findOne({
        where: { userId, vacancyId },
      });

      if (!respond) {
        return res.status(404).json({
          message: 'Отклик не найден',
          ok: false,
          error: '404',
        });
      }

      await this.respondReposity.destroy({
        where: { userId, vacancyId },
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

  async getRespondsToVacancy(vacancyId, params, res) {
    try {
      const { offset = 0, sort = 'new' } = params;

      const responds = await this.respondReposity.findAll({
        where: { vacancyId },
        offset,
        order: sort == 'new' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']],
        include: { all: true },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responds,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getUserResponds(userId, params, res) {
    try {
      const { offset = 0, sort = 'new' } = params;

      const responds = await this.respondReposity.findAll({
        where: { userId },
        offset,
        order: sort == 'new' ? [['createdAt', 'ASC']] : [['createdAt', 'DESC']],
        include: { all: true },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responds,
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
