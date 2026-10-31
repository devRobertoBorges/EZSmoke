import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token.js";

// Lê o token do cabeçalho "Authorization: Bearer <token>"
function readToken(req: Request) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return null;
    }

    const token = header.slice("Bearer ".length).trim();
    return token.length > 0 ? token : null;
}

function invalidSession(res: Response) {
    return res.status(401).json({
        success: false,
        message: "Sessão inválida ou expirada. Faça login novamente.",
    });
}

// Para rotas que EXIGEM login (ex.: /auth/me)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = readToken(req);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Faça login para continuar.",
        });
    }

    try {
        const { userId, role } = verifyToken(token);
        res.locals.userId = userId;
        res.locals.userRole = role;
        return next();
    } catch {
        return invalidSession(res);
    }
}

// Para rotas que funcionam COM ou SEM login (ex.: detalhe da lineup).
// Sem token, segue como visitante. Com token inválido, avisa,
// para o frontend saber que precisa pedir login de novo.
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
    const token = readToken(req);

    if (!token) {
        return next();
    }

    try {
        const { userId, role } = verifyToken(token);
        res.locals.userId = userId;
        res.locals.userRole = role;
        return next();
    } catch {
        return invalidSession(res);
    }
}