import bcrypt from "bcrypt";
import {
    findUserByEmail,
    findUserById,
} from "../repositories/user.repository.js";
import { userHasPremium } from "../repositories/premium.repository.js";
import { generateToken } from "../utils/token.js";

interface LoginData {
    email: string;
    password: string;
}

export async function loginUser(data: LoginData) {
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (password.length === 0 || password.length > 72) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Conferido só DEPOIS da senha: quem não sabe a senha
    // não consegue descobrir que a conta existe e está desativada.
    if (!user.is_active) {
        throw new Error("ACCOUNT_DISABLED");
    }

    return {
        token: generateToken({ id: user.id, role: user.role }),
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}

export async function getCurrentUser(userId: number) {
    const user = await findUserById(userId);

    // Conta apagada ou desativada: o token deixa de valer.
    // O frontend recebe 401 e desloga a pessoa sozinho.
    if (!user || !user.is_active) {
        throw new Error("USER_NOT_FOUND");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: await userHasPremium(user.id),
    };
}