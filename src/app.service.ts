import getTransplit from 'src/vendor/getTransplit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getTransplitString(message: string, res: any) {
    try {
      if (!message?.length) {
        return res.status(501).json({
          message: 'Ожидается передача сообщения в виде строки',
          ok: false,
          error: 'Введите сообщение',
        });
      }
      const result = await getTransplit(message);

      return res.status(200).json({
        message: 'Перевели',
        ok: true,
        result,
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
