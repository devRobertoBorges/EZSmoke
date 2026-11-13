import { Router } from "express";
import { createAccount } from "../controllers/user.controller.js";
import { getMe, loginAccount } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    loginLimiter,
    registerLimiter,
} from "../middlewares/rate-limit.middleware.js";

const authRoutes = Router();

authRoutes.post("/auth/register", registerLimiter, createAccount);
authRoutes.post("/auth/login", loginLimiter, loginAccount);
authRoutes.get("/auth/me", requireAuth, getMe);

export default authRoutes;