// authController.ts
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: Error, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Use a função login do Passport para estabelecer uma sessão
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        // Aqui você pode gerar e retornar um token JWT se desejar
        return res.json({ message: 'Login bem-sucedido', user });
      });
    })(req, res, next);
  },
};
