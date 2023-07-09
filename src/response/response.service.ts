import { Injectable } from '@nestjs/common';
import { ResponseModel } from './models/response.model';
import { InjectModel } from '@nestjs/sequelize';
import { getAutor } from 'src/vendor/getAutor';
import { NotificationService } from 'src/notification/notification.service';
import { Vacancy } from 'src/vacancy/models/vacancy.model';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(ResponseModel) private responseReposity: typeof ResponseModel,
    @InjectModel(Vacancy) private vacancyReposity: typeof Vacancy,
    private notificationService: NotificationService,
  ) {}

  async createResponse(href, body, headers, res) {
    try {
      const autor = await getAutor(headers);
      const vacancy = await this.vacancyReposity.findOne({ where: { href } });

      if (!autor.ok) {
        return res.status(401).json({
          message: 'Необхоидмо поддтвердить авторизацию',
          ok: false,
          status: 401,
          error: 'Unautorisate',
        });
      }

      if (!vacancy) {
        return res.status(404).json({
          message: 'Вакансия не найдена',
          ok: false,
          status: 404,
          error: 'Not Found',
        });
      }

      const response = await this.responseReposity.create({
        ...body,
        autorId: autor.id,
        vacancyId: vacancy.id,
      });

      // this.notificationService.createNotification({
      //   type: 'response',
      //   userId: response.vacancy.autorId,
      //   body: 'На вашу вакансию откликнулись',
      //   title: 'Новый отклик',
      // });

      return res.status(200).json({
        messager: 'Отклик успешно оставлен',
        ok: true,
        response,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
        error: e,
      });
    }
  }

  async deleteResponse(param, res) {
    try {
      const { autorId, vacancyId } = param;

      const respond = await this.responseReposity.findOne({
        where: { autorId, vacancyId },
      });

      if (!respond) {
        return res.status(404).json({
          message: 'Отклик не найден',
          ok: false,
          status: 404,
          error: 'Not Found',
        });
      }

      await this.responseReposity.destroy({
        where: { autorId, vacancyId },
      });

      return res.status(200).json({
        message: 'Отклик успешно удален',
        ok: true,
      });
    } catch (e) {
      console.log(e);
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
        error: e,
      });
    }
  }

  async getResponsesToVacancy(vacancyId, res) {
    try {
      const responses = await this.responseReposity.findAll({
        where: { vacancyId },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responses,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
        error: e,
      });
    }
  }

  async getUserResponses(autorId, res) {
    try {
      const responses = await this.responseReposity.findAll({
        where: { autorId },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        ok: true,
        responses,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        status: 501,
        error: e,
      });
    }
  }
}
