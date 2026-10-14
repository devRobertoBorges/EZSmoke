
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { database } from "../config/database.js";

interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    passwordHash: string;
}

export async function findUserByEmail(email: string) {
    const [rows] = await database.query<UserRow[]>(
        `SELECT id, name, email, password_hash, role
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email],
    );

    return rows[0] ?? null;
}

export async function createUser(data: CreateUserData) {
    const [result] = await database.execute<ResultSetHeader>(
        `INSERT INTO users (name, email, password_hash)
         VALUES (?, ?, ?)`,
        [data.name, data.email, data.passwordHash],
    );

    return {
        id: result.insertId,
        name: data.name,
        email: data.email,
        role: "USER",
    };
}
