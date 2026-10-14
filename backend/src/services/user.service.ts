
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

    return createUser({
        name,
        email,
        passwordHash,
    });
}
