import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../auth/auth.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(User) private userReposity: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async changePassword({ email, password, newPassword }, res) {
    try {
      const candidate = await this.userReposity.findOne({
        where: { email },
      });

      if (!candidate) {
        return res.status(404).json({
          message: 'Не удалось найти пользователя',
          ok: false,
          error: 'NotFound',
        });
      }

      const isPassword = await bcrypt.compare(password, candidate.password);

      if (!isPassword) {
        return res.status(301).json({
          message: 'Неверный пароль',
          ok: false,
        });
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);

      const token = this.jwt.sign(
        {
          id: candidate.id,
          name: candidate.firstname,
          lastname: candidate.lastname,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '15d',
        },
      );

      await candidate.$set('password', hashPassword);

      return res.status(200).json({
        message: 'Пароль успешно изменён',
        ok: true,
        token,
        user: candidate,
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
