// config/passport.ts
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy.Strategy(
    { usernameField: 'email', passwordField: 'senha' },
    async (email, senha, done) => {
      try {
        const usuario = await prisma.user.findUnique({ where: { email } });

        if (!usuario || !bcrypt.compareSync(senha, usuario?.senha)) {
          return done(null, false, { message: 'Credenciais inválidas' });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((usuario: any, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await prisma.user.findUnique({ where: { id: Number(id) } });

    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;
