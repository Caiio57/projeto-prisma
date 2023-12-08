// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function verificarAutenticacao(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Não autorizado' });
}
