import { Request, Response } from 'express';
import { prisma } from "../database/prisma"

export const createAccess = async (req: Request, res: Response) => {
  const { name } = req.body;
  try{
  const access = await prisma.access.create({
      data: { name }
    });

    return res.json(access);
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};


export const getAllAccesses = async (req: Request, res: Response) => {
    try{
const accesses = await prisma.access.findMany();
  
      return res.json(accesses);
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  };

 