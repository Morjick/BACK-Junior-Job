import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/auth.model';

export async function getUserByToken(token: string) {
  const bearer = String(token).split(' ')[1];
  const jwt = new JwtService();

  if (!bearer) {
    return {
      ok: false
    };
  }

  const { id } = jwt.verify(bearer, {
    secret: process.env.JWT_SECRET_KEY,
  });

  const user = await User.findOne({ where: { id } });

  return {ok: true, user};
}
