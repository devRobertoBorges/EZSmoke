import { Router } from "express";
import { createAccount } from "../controllers/user.controller.js";
import { loginAccount } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/auth/register", createAccount);
authRoutes.post("/auth/login", loginAccount);

export default authRoutes;