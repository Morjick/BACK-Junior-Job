import { Injectable } from '@nestjs/common';
import { ResponseModel } from './models/response.model';
import { InjectModel } from '@nestjs/sequelize';
import { getAutor } from 'src/vendor/getAutor';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(ResponseModel) private responseReposity: typeof ResponseModel,
  ) {}

  async createResponse(body, headers, res) {
    try {
      const autor = await getAutor(headers);

      if (!autor.ok) {
        return res.status(401).json({
          message: 'Необхоидмо поддтвердить авторизацию',
          ok: false,
          status: 401,
          error: 'Unautorisate',
        });
      }

      if (!body.targetId) {
        return res.status(301).json({
          message: 'Укажитье уникальный идентификатор статьи',
          error: 'field: targetId is empty',
          ok: false,
        });
      }

      const response = await this.responseReposity.create({
        ...body,
        autorId: autor.id,
      });

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

  async getResponses(params, res) {
    try {
      const { targetId } = params;

      const responses = await this.responseReposity.findAll({
        where: { targetId },
      });

      return res.status(200).json({
        message: 'Отклики получены',
        responses,
        ok: true,
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
