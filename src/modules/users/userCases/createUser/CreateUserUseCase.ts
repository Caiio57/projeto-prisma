import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { PrismaClient, User } from "@prisma/client";
import { AppError } from "../../../../error/AppError";
const Prisma = new PrismaClient();


export class CreateUserUseCase {
    async execute({ name, email, senha }: CreateUserDTO):Promise<User> {
        try {
            const usuarioExistente = await Prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (usuarioExistente) {
                throw new AppError("Usuário já existe!", 400);
            }

            const novoUsuario = await Prisma.user.create({
                data: {
                    name,
                    email,
                    senha, 
                },
            });

            return novoUsuario;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }
}

