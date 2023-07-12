import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/auth.model';
import { Vacancy } from 'src/vacancy/models/vacancy.model';
import { addVacancytoFavorites } from './dto/addVacancyFavorites';
import { getAutor } from 'src/vendor/getAutor';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(User) private userReposity: typeof User,
    @InjectModel(Vacancy) private vacancyReposity: typeof Vacancy,
  ) {}

  async addVacancyToFavorites(body: addVacancytoFavorites, headers, res) {
    try {
      const { id, ok } = await getAutor(headers);

      if (!ok) {
        return res.status(401).json({
          message: 'Не удалось подтвердить авторизацию',
          ok: false,
        });
      }

      const user = await this.userReposity.findByPk(id, {
        include: { all: true },
      });

      const vacancy = await this.vacancyReposity.findByPk(body.vacancy, {
        include: { all: true },
      });

      if (!vacancy) {
        return res.status(401).json({
          message: 'Не удалось найти вакансию',
          ok: false,
        });
      }

      let favorites = user.favoritesVacancyId;
      console.log(favorites);

      if (!favorites) {
        favorites = [vacancy.id];
      } else {
        favorites.push(vacancy.id);
      }

      await this.userReposity.update(
        { favoritesVacancyId: favorites },
        { where: { id } },
      );

      return res.status(200).json({
        message: 'Вакансия добавлена в избранное',
        ok: true,
        vacancy,
        user,
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

  async getFavorites(id, res) {
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
        favorites: user.favoritesVacancy,
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
}
