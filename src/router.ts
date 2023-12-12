import { Router } from "express";
import { createAccess, getAllAccesses } from "./controllers/AccessController";
import { signIn } from "./controllers/SessãoController";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getUniqueUser,
} from "./controllers/UserController";

import { verificarAutenticacao } from "./middleware/authMiddleware";

export const router = Router();

/**
 * Rotas do usuário
 */
router.post("/user", createUser);
router.delete("/delete-users", verificarAutenticacao(["Admin"]), deleteManyUser);
router.get("/get-all-users", verificarAutenticacao(["Admin"]), getAllUser);
router.get(
  "/get-unique-user",
  verificarAutenticacao(["adm", "Vendedor", "Comprador"]),
  getUniqueUser,
);

/**
 * Rotas de acessos
 */
router.post("/access", verificarAutenticacao(["Admin"]), createAccess);
router.get("/accesses", verificarAutenticacao(["Admin", "Vendedor"]), getAllAccesses);

/**
 * Rotas de autenticação
 */
router.post("/sign-in", signIn);

