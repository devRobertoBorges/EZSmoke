
import bcrypt from "bcrypt";
import {
    createUser,
    findUserByEmail,
} from "../repositories/user.repository.js";

interface RegisterUserData {
    name: string;
    email: string;
    password: string;
}

export async function registerUser(data: RegisterUserData) {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (name.length < 2 || name.length > 100) {
        throw new Error("INVALID_NAME");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
        throw new Error("INVALID_EMAIL");
    }

    if (password.length < 8 || password.length > 72) {
        throw new Error("INVALID_PASSWORD");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        return await createUser({
            name,
            email,
            passwordHash,
        });
    } catch (error) {
        // Dois cadastros com o mesmo e-mail ao mesmo tempo: a checagem acima
        // passa para os dois, mas o UNIQUE do banco barra o segundo.
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            throw new Error("EMAIL_ALREADY_REGISTERED");
        }

        throw error;
    }
}
