
import type { Request, Response } from "express";
import { registerUser } from "../services/user.service.js";

export async function createAccount(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body ?? {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Informe nome, e-mail e senha válidos.",
            });
        }

        const user = await registerUser({
            name,
            email,
            password,
        });

        return res.status(201).json({
            success: true,
            message: "Conta criada com sucesso.",
            data: user,
        });
    } catch (error) {
        if (error instanceof Error) {
            const errors: Record<string, { status: number; message: string }> = {
                INVALID_NAME: {
                    status: 400,
                    message: "O nome deve ter entre 2 e 100 caracteres.",
                },
                INVALID_EMAIL: {
                    status: 400,
                    message: "Informe um e-mail válido.",
                },
                INVALID_PASSWORD: {
                    status: 400,
                    message: "A senha deve ter entre 8 e 72 caracteres.",
                },
                EMAIL_ALREADY_REGISTERED: {
                    status: 409,
                    message: "Este e-mail já está cadastrado.",
                },
            };

            const knownError = errors[error.message];

            if (knownError) {
                return res.status(knownError.status).json({
                    success: false,
                    message: knownError.message,
                });
            }
        }

        console.error("Erro ao cadastrar usuário:", error);

        return res.status(500).json({
            success: false,
            message: "Erro interno ao criar a conta.",
        });
    }
}
