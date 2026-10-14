
import type { RowDataPacket } from "mysql2/promise";
import { database } from "../config/database.js";

interface LineupRow extends RowDataPacket {
    id: number;
    map_id: number;
    map_name: string;
    map_slug: string;
    map_is_free: number;
    name: string;
    side: string;
    region: string;
    utility_type: string;
    description: string;
    position: string;
    aim: string;
    throw_type: string;
    keywords: string | null;
    result_image_url: string;
    execution_media_url: string;
    execution_media_type: string;
}

export interface LineupFilters {
    map?: string;
    side?: string;
    region?: string;
    type?: string;
    search?: string;
}

export async function findAllLineups(filters: LineupFilters) {
    const conditions: string[] = ["l.is_active = TRUE"];
    const params: (string | number)[] = [];

    if (filters.map) {
        conditions.push("m.slug = ?");
        params.push(filters.map);
    }

    if (filters.side) {
        conditions.push("l.side = ?");
        params.push(filters.side);
    }

    if (filters.region) {
        conditions.push("l.region = ?");
        params.push(filters.region);
    }

    if (filters.type) {
        conditions.push("l.utility_type = ?");
        params.push(filters.type);
    }

    if (filters.search) {
        conditions.push(`(
            l.name LIKE ?
            OR l.description LIKE ?
            OR l.keywords LIKE ?
            OR m.name LIKE ?
        )`);

        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const sql = `
        SELECT
            l.id,
            l.map_id,
            m.name AS map_name,
            m.slug AS map_slug,
            m.is_free AS map_is_free,
            l.name,
            l.side,
            l.region,
            l.utility_type,
            l.description,
            l.position,
            l.aim,
            l.throw_type,
            l.keywords,
            l.result_image_url,
            l.execution_media_url,
            l.execution_media_type
        FROM lineups l
        INNER JOIN maps m ON m.id = l.map_id
        WHERE ${conditions.join(" AND ")}
        ORDER BY l.id DESC
    `;

    const [rows] = await database.query<LineupRow[]>(sql, params);

return rows.map((lineup) => ({
    id: lineup.id,
    name: lineup.name,
    side: lineup.side,
    region: lineup.region,
    utilityType: lineup.utility_type,
    description: lineup.description,

    map: {
        id: lineup.map_id,
        name: lineup.map_name,
        slug: lineup.map_slug,
        isFree: Boolean(lineup.map_is_free),
    },

    execution: {
        position: lineup.position,
        aim: lineup.aim,
        throwType: lineup.throw_type,
    },

    keywords: lineup.keywords,

    resultImageUrl: lineup.result_image_url,
    executionMediaUrl: lineup.execution_media_url,
    executionMediaType: lineup.execution_media_type,
}))};