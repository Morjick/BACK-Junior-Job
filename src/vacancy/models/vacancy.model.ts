import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/auth/auth.model';
import { VacancyCategory } from './category.model';
import { ResponseModel } from 'src/response/models/response.model';

@Table
export class Vacancy extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Href is required field' },
    },
  })
  href: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.BOOLEAN })
  show: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @BelongsTo(() => User)
  author: User;

  @ForeignKey(() => VacancyCategory)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => VacancyCategory)
  category: VacancyCategory;

  @ForeignKey(() => VacancyCategory)
  @Column({ type: DataType.ARRAY(DataType.INTEGER) })
  responseId: number[];

  @HasMany(() => ResponseModel)
  response: ResponseModel[];
}
