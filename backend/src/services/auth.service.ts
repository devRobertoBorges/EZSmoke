import bcrypt from "bcrypt";
import { findUserByEmail } from "../repositories/user.repository.js";

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

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash,
    );

    if (!passwordMatches) {
        throw new Error("INVALID_CREDENTIALS");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}