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

  async createResponse(body, headers, res) {
    try {
      const { autor, ok } = await getAutor(headers);

      if (!ok || !autor.id) {
        return res.status(401).json({
          message: 'Необхоидмо поддтвердить авторизацию',
          ok: false,
          status: 401,
          error: 'Unautorisate',
        });
      }

      if (!body.targetId) {
        return res.status(301).json({
          message: 'Укажитье уникальный идентификатор вакансии',
          error: 'field: targetId is empty',
          ok: false,
        });
      }

      const response = await this.responseReposity.create({
        vacancyId: body.targetId,
        autorId: autor.id,
        body: body.body,
      });

      const vacancy = await this.vacancyReposity.findByPk(body.targetId, {
        include: { all: true },
      });

      this.notificationService.createNotification({
        type: 'response',
        userId: autor.id,
        body: 'На вашу вакансию откликнулись',
        title: 'Новый отклик',
      });

      return res.status(200).json({
        messager: 'Отклик успешно оставлен',
        ok: true,
        response,
        vacancy,
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

  async getResponses(params, res) {
    try {
      const { targetId } = params;

      const responses = await this.responseReposity.findAll({
        where: { id: targetId },
        include: { all: true },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        responses,
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
}
