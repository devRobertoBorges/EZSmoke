import mysql from "mysql2/promise";
import { env } from "./env.js";

export const database = mysql.createPool({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
});