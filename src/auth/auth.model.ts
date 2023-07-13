import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Articles } from 'src/articles/articles.model';
import { Vacancy } from 'src/vacancy/models/vacancy.model';
import { Notification } from 'src/notification/models/notification.model';
import { SocketModel } from 'src/message/models/socket.model';
import { Message } from 'src/message/models/message.model';

@Table
export class User extends Model {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Матвей', description: 'Имя пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'BasePrice is required field' },
    },
  })
  firstname: string;

  @ApiProperty({ example: 'Храмов', description: 'Фамилия пользователя' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'BasePrice is required field' },
    },
  })
  lastname: string;

  @ApiProperty({ example: 'matvey-khramov@inbox.ru', description: 'Email' })
  @Column({ type: DataType.STRING })
  email: string;

  @ApiProperty({
    example: 'ljawdbvahwdvawhdb',
    description: 'Password',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'BasePrice is required field' },
    },
  })
  password: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  modarate: boolean;

  @Column({ type: DataType.INTEGER })
  modarator: number;

  @Column({ type: DataType.STRING })
  implication: string;

  @Column({ type: DataType.INTEGER })
  age: number;

  @Column({ type: DataType.STRING })
  birsday: string;

  @Column({ type: DataType.STRING })
  learn: string;

  @Column({ type: DataType.STRING })
  inn: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING, defaultValue: 'USER' })
  role: string;

  @HasMany(() => Articles)
  articles: Articles[];

  @HasMany(() => Vacancy)
  vacancy: Vacancy[];

  @HasMany(() => Notification)
  notifications: Notification[];

  @HasMany(() => SocketModel)
  sockets: SocketModel[];

  @HasMany(() => Message)
  messages: Message[];
}
