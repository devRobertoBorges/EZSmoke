import type { RowDataPacket } from "mysql2/promise";
import { database } from "../config/database.js";

interface PremiumRow extends RowDataPacket {
    is_premium: number;
}

// Regra definida no README: o usuário é Premium se e somente se
// existir uma compra com status PAID vinculada a ele.
export async function userHasPremium(userId: number) {
    const [rows] = await database.query<PremiumRow[]>(
        `SELECT EXISTS (
            SELECT 1
            FROM premium_purchases
            WHERE user_id = ? AND status = 'PAID'
        ) AS is_premium`,
        [userId],
    );

    return Boolean(rows[0]?.is_premium);
}