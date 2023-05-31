import { Injectable } from '@nestjs/common';
import { Apeal } from './models/apeal.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateApealDto } from './dto/create-apeal.dto';

@Injectable()
export class SupportService {
  constructor(@InjectModel(Apeal) private apealReposity: typeof Apeal) {}

  async createApeal(data: CreateApealDto, res) {
    try {
      if (!data.phonoe) {
        return res.status(303).json({
          message: 'Укажите, пожауйлста, номер телефона',
          error: 'require variable',
          ok: false,
        });
      }

      const apeal = await this.apealReposity.create({ ...data });

      return res.status(200).json({
        message: 'Жалоба зарегистрирована',
        ok: true,
        apeal,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async deleteApeal(data, res) {
    try {
      const candidate = await this.apealReposity.findOne({
        where: { id: data.id },
      });

      if (!candidate) {
        return res.status(404).json({
          message: 'Не удалось найти обращение',
          ok: false,
        });
      }

      await this.apealReposity.destroy({ where: { id: data.id } });

      return res.status(200).json({
        message: 'Запись успешно удалена',
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

  async getApeals({ modarate = true }, res) {
    try {
      const apeals = await this.apealReposity.findAll({
        where: { modarate },
      });

      return res.status(200).json({
        message: 'Записи получены',
        ok: true,
        apeals,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getApeal({ id }, res) {
    try {
      const apeal = await this.apealReposity.findAll({
        where: { id },
      });

      return res.status(200).json({
        message: 'Записи получены',
        ok: true,
        apeal,
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
