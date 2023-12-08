import { Router } from "express";
import { createUser, getAllUser } from "../controllers/UserController";
import { createAccess, getAllAccesses } from "../controllers/AccessController";

export const router = Router()

router.post("/usuario", createUser);
router.post("/acesso", createAccess);
router.get("/acessos", getAllAccesses);
router.get("/all-usuarios", getAllUser);