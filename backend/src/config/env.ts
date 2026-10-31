import "dotenv/config";

export const env = {
    port: Number(process.env.PORT) || 3333,
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT) || 3306,
    dbUser: process.env.DB_USER || "root",
    dbPassword: process.env.DB_PASSWORD || "",
    dbName: process.env.DB_NAME || "ezsmoke",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtExpiresInSeconds: 60 * 60 * 24 * 7, // 7 dias
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};

// Sem a chave, qualquer token seria inseguro.
// Melhor o servidor nem ligar do que funcionar desprotegido.
if (env.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET ausente ou muito curto no arquivo .env");
}