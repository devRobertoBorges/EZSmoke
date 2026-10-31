import type { Request, Response } from "express";
import { getCurrentUser, loginUser } from "../services/auth.service.js";

export async function loginAccount(req: Request, res: Response) {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Informe e-mail e senha.",
            });
        }

        const user = await loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login realizado com sucesso.",
            data: user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "INVALID_CREDENTIALS"
        ) {
            return res.status(401).json({
                success: false,
                message: "E-mail ou senha inválidos.",
            });
        }

        console.error("Erro ao realizar login:", error);

        return res.status(500).json({
            success: false,
            message: "Erro interno ao realizar login.",
        });
    }
}

export async function getMe(_req: Request, res: Response) {
    try {
        const user = await getCurrentUser(res.locals.userId);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "USER_NOT_FOUND") {
            return res.status(401).json({
                success: false,
                message: "Sessão inválida. Faça login novamente.",
            });
        }

        console.error("Erro ao buscar usuário atual:", error);

        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar o usuário.",
        });
    }
}