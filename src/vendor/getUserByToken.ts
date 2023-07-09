import { JwtService } from '@nestjs/jwt';
import { User } from '../auth/auth.model';

export async function getUserByToken(token: string) {
  const bearer = String(token).split(' ')[1];
  const jwt = new JwtService();

  if (!bearer) {
    return null;
  }

  const { id } = jwt.verify(bearer, {
    secret: process.env.JWT_SECRET_KEY,
  });

  const autor = await User.findOne({ where: { id } });

  return autor;
}
