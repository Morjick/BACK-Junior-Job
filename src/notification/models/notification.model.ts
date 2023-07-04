import { User } from 'src/auth/auth.model';
import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Notification extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  type: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  // id отправителя, понадобится для сообщений
  @Column({ type: DataType.INTEGER, defaultValue: null })
  senderId: number;

  // флажок получения уведомления пользователем, понадобится при интеграции с сокетом
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  received: boolean;

  @Column({ type: DataType.STRING, defaultValue: null })
  title: string;

  @Column({ type: DataType.STRING })
  body: string;
}
