import type { RowDataPacket } from "mysql2/promise";
import { database } from "../config/database.js";

interface PremiumRow extends RowDataPacket {
    is_premium: number;
}

// Regra definida no README: o usuário é Premium se e somente se
// existir uma compra com status PAID vinculada a ele.
// Além disso, a conta precisa estar ativa.
export async function userHasPremium(userId: number) {
    const [rows] = await database.query<PremiumRow[]>(
        `SELECT EXISTS (
            SELECT 1
            FROM premium_purchases p
            INNER JOIN users u ON u.id = p.user_id
            WHERE p.user_id = ?
              AND p.status = 'PAID'
              AND u.is_active = TRUE
        ) AS is_premium`,
        [userId],
    );

    return Boolean(rows[0]?.is_premium);
}