import { rateLimit } from "express-rate-limit";

// Login: 10 tentativas ERRADAS a cada 15 minutos, por IP.
// Logins que dão certo não contam, então quem acerta a senha nunca é bloqueado.
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
    },
});

// Cadastro: 5 contas por hora, por IP.
// Dificulta criar contas em massa e testar quais e-mails já existem.
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Muitos cadastros a partir desta conexão. Tente novamente mais tarde.",
    },
});

// ATENÇÃO para o deploy: se o backend ficar atrás de um proxy
// (a maioria das hospedagens), será preciso configurar o "trust proxy"
// no app.ts. Sem isso, todos os usuários pareceriam ter o mesmo IP.