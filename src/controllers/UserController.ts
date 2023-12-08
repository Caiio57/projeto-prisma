import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../database/prisma';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, senha, accessName } = req.body;

  try {
    const usuarioExistente = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const verificacaoAcesso = await prisma.access.findUnique({
      where: {
        name: accessName,
      },
    });

    if (usuarioExistente) {
      res.status(400).json({ message: 'E-mail já cadastrado' });
      return;
    }

    if (!verificacaoAcesso) {
      return res.status(400).json({ message: 'Este nivel de acesso não existe' });
    }

    const senhaEncript = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        senha: senhaEncript,
        userAccess: {
          createMany: {
           data: {
            accessId: accessName
           }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({ message: 'Usuário registrado com sucesso', user: novoUsuario });
  } catch (error) {
    console.error('Erro no registro:', error);

    // Se ocorrer um erro, evite criar o usuário no banco de dados

    if (error instanceof Error) {
      res.status(500).json({ message: 'Erro interno no servidor' });
    } else {
      res.status(500).json({ message: 'Erro inesperado no servidor' });
    }
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      userAccess: {
        select: {
          Access: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  return res.json(users);
}

