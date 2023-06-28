import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './auth.model';
import { validationPassword } from 'src/vendor/validationPassword';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userReposity: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async singUp(body: any, res) {
    try {
      const isAlreadyUser = await this.userReposity.findOne({
        where: { email: body.email },
      });

      if (isAlreadyUser) {
        return res.status(301).json({
          message: 'Пользователь с таким email уже существует',
          ok: false,
        });
      }

      const isPasswordValid = await validationPassword(
        body.password,
        body.firstname,
      );

      if (!isPasswordValid.ok) {
        return res.status(300).json(isPasswordValid);
      }
      const hashPassword = await bcrypt.hash(body.password, 10);

      if (body.implication !== 'legal' && body.implication !== 'physical') {
        return res.status(300).json({
          message: 'Укажите, вы физическое или юридическое лицо',
          ok: false,
        });
      }

      const candidate = await this.userReposity.create({
        ...body,
        banned: false,
        password: hashPassword,
        modarate: body.implication === 'psyhical',
      });

      const token = this.jwt.sign(
        {
          id: candidate.id,
          name: candidate.firstname,
          lastname: candidate.lastname,
          role: candidate.role,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '15d',
        },
      );

      return res.status(200).json({
        message: 'Пользователь создан',
        user: candidate,
        token,
        ok: true,
      });
    } catch (e) {
      console.warn(e);
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async singIn(body, res) {
    try {
      const { email, password } = body;

      const candidate = await this.userReposity.findOne({ where: { email } });

      if (!email) {
        return res.status(404).json({
          message: 'Пользователь с таким email не найден',
          ok: false,
        });
      }

      const isPassword = await bcrypt.compare(password, candidate.password);

      if (!isPassword) {
        return res.status(301).json({
          message: 'Неверный пароль',
          ok: false,
        });
      }

      const token = this.jwt.sign(
        {
          id: candidate.id,
          name: candidate.firstname,
          lastname: candidate.lastname,
          role: candidate.role,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: '15d',
        },
      );

      return res.status(200).json({
        message: 'Успешно',
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

  async checkToken(headers, res) {
    try {
      const bearer = String(headers.authorization).split(' ')[1];

      if (!bearer) {
        return res.status(501).json({
          message: 'Необходимо авторизоваться',
          ok: false,
          status: 401,
        });
      }

      const { id } = this.jwt.verify(bearer, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!id) {
        return res.status(401).json({
          message: 'Не удалось подтвердить авторизацию',
          ok: false,
          status: 401,
        });
      }

      const user = await this.userReposity.findOne({ where: { id } });

      return res.status(200).json({
        message: 'Авторизация подтверждена',
        ok: true,
        user,
      });
    } catch (e) {
      return res.status(501).json({
        message: 'Неожиданная ошибка сервера',
        ok: false,
        error: e,
      });
    }
  }

  async getUser(id, res) {
    try {
      const user = await this.userReposity.findOne({
        where: { id },
        include: { all: true },
      });

      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
          ok: false,
          error: 'Not Found',
        });
      }

      return res.status(200).json({
        message: 'Пользователь найден',
        user,
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

  async getMany(params, res) {
    try {
      const {
        limit = 50,
        offset = 0,
        firstname = '',
        lastname = '',
        banned = false,
      } = params;

      const users = await this.userReposity.findAll({
        limit,
        offset,
        where: {
          banned,
          name: {
            [Op.like]: `%${firstname}%`,
          },
          lastname: {
            [Op.like]: `%${lastname}%`,
          },
        },
        include: { all: true },
      });

      return res.status(200).json({
        message: 'Пользователи найдены',
        ok: true,
        users,
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
