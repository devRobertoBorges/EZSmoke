import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(user: { id: number; role: string }) {
    return jwt.sign({ role: user.role }, env.jwtSecret, {
        subject: String(user.id),
        expiresIn: env.jwtExpiresInSeconds,
        algorithm: "HS256",
    });
}

export function verifyToken(token: string) {
    // Lança erro se a assinatura for inválida ou se o token tiver expirado
    const payload = jwt.verify(token, env.jwtSecret, {
        algorithms: ["HS256"],
    });

    if (typeof payload === "string" || !payload.sub) {
        throw new Error("INVALID_TOKEN");
    }

    return {
        userId: Number(payload.sub),
        role: String(payload.role),
    };
}