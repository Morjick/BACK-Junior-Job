import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class StaticService {
  getImage(filename: string, res: any) {
    try {
      const image = createReadStream(
        join(process.env.STATIC_PATH, `/images/${filename}`),
      );

      image.on('error', (e) => {
        return res.status(404).json({
          message: 'Изображение не найдено',
          ok: false,
          error: e,
        });
      });

      image.pipe(res);
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошиюка сервера',
        ok: false,
        error: e,
      });
    }
  }

  postImage(file: Express.Multer.File, res: any) {
    try {
      const image = {
        name: file.filename,
        size: file.size,
      }

      return res.status(200).json({
        message: 'Изображение загружено',
        ok: true,
        image,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошиюка сервера',
        ok: false,
        error: e,
      });
    }
  }
}
