import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/auth.model';

export async function getAutor(headers: any) {
  const bearer = String(headers.authorization).split(' ')[1];
  const jwt = new JwtService();

  if (!bearer) {
    return {
      ok: false,
      autor: null,
      status: 401,
    };
  }

  const { role, name, id, implication } = jwt.verify(bearer, {
    secret: process.env.JWT_SECRET_KEY,
  });

  const autor = await User.findOne({ where: { id } });

  return {
    ok: true,
    autor,
    role,
    name,
    implication,
    id,
  };
}
