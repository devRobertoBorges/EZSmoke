
import { database } from "../config/database.js";
import type { RowDataPacket } from "mysql2/promise";

interface MapRow extends RowDataPacket {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    is_free: number;
}

export async function findAllMaps() {
    const [rows] = await database.query<MapRow[]>(
        `SELECT id, name, slug, image_url, is_free
         FROM maps
         WHERE is_active = TRUE
         ORDER BY id ASC`
    );

    return rows.map((map) => ({
        id: map.id,
        name: map.name,
        slug: map.slug,
        imageUrl: map.image_url,
        isFree: Boolean(map.is_free),
    }));
}