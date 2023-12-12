import { compare } from "bcrypt";
import { Request, Response } from "express";
import { sign } from 'jsonwebtoken';
import { prisma } from "../database/prisma";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const isPasswordValid = await compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    const CHAVE_SECRETA = process.env.CHAVE_SECRETA;

    if (!CHAVE_SECRETA) {
      throw new Error("Chave secreta não fonercida");
    }

    const token = sign({
      userId: user.id, roles: user.userAccess.map(role => role.Access?.name)
    }, CHAVE_SECRETA, {
      algorithm: "HS256",
      expiresIn: "1h"
    })

    return res.status(200).json({token})

  } catch (error) {
    return res.status(400).json(error);
  }
};