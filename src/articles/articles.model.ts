import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/auth/auth.model';

@Table
export class Articles extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING })
  title: string;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING })
  body: string;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING })
  avatar: string;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING })
  href: string;

  @ApiProperty({ example: true, description: 'true' })
  @Column({ type: DataType.BOOLEAN })
  show: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  autorId: number;

  @BelongsTo(() => User)
  author: User;
}
