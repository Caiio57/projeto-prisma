import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    // Verificar a senha
    const compararSenha = await bcrypt.compare(senha, user.senha);

    if (!compararSenha) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    // Gerar um token JWT
    const token = jwt.sign({ userId: user.id }, 'suaChaveSecreta', { expiresIn: '1h' });

    // Retornar o token
    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};


