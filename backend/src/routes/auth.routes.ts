import { Router } from "express";
import { createAccount } from "../controllers/user.controller.js";
import { getMe, loginAccount } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/auth/register", createAccount);
authRoutes.post("/auth/login", loginAccount);
authRoutes.get("/auth/me", requireAuth, getMe);

export default authRoutes;