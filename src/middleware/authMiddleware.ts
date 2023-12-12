import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';
import { prisma } from "../database/prisma";

interface DecodedToken {
  userId: string;
}

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}


export function verificarAutenticacao(permissions?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({message: "Token não fornecido"})
    }

    const token = authHeader.substring(7);

    try {
      const CHAVE_SECRETA = process.env.CHAVE_SECRETA

      if(!CHAVE_SECRETA) {
        throw new Error("Chave secreta não fonercida")
      }

      const decodedToken = verify(token, CHAVE_SECRETA) as DecodedToken

      req.user = {id: decodedToken.userId}

      if(permissions) {
        const user = await prisma.user.findUnique({
          where: {
            id: decodedToken.userId
          },
          include: {
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
        });
        
        const userPermissions = user?.userAccess.map((na) => na.Access?.name) ?? []
        const hasPermission = permissions.some((p) => userPermissions.includes(p))

        if(!hasPermission) {
          return res.status(403).json({message: "Permissão negada."})
        }
      }

      return next()

    } catch (error) {
      return res.status(401).json({message: "Token invalido."})
    }
  }
}