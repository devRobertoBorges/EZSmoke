import type { RowDataPacket } from "mysql2/promise";
import { database } from "../config/database.js";

// Formato da linha que vem do banco.
// Só os campos do card: nada de posição, mira ou mídia de execução.
interface LineupCardRow extends RowDataPacket {
    id: number;
    slug: string;
    name: string;
    side: string;
    region: string;
    area: string | null;
    utility_type: string;
    description: string;
    result_image_url: string | null;
    map_id: number;
    map_name: string;
    map_slug: string;
    map_is_free: number;
}

// Filtros já interpretados pelo service.
// "text" já vem no formato da busca FULLTEXT (ex.: "+jungle*").
export interface LineupFilters {
    map?: string;
    side?: string;
    region?: string;
    type?: string;
    text?: string;
}

// Precisa ser exatamente a mesma lista de colunas do índice FULLTEXT no schema.sql
const FULLTEXT_MATCH =
    "MATCH (l.name, l.area, l.description, l.keywords) AGAINST (? IN BOOLEAN MODE)";

export async function findAllLineups(filters: LineupFilters) {
    // Só lineups publicadas, de mapas ativos
    const conditions: string[] = [
        "l.status = 'PUBLISHED'",
        "m.is_active = TRUE",
    ];
    const params: string[] = [];

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

    if (filters.text) {
        conditions.push(FULLTEXT_MATCH);
        params.push(filters.text);
    }

    // Com busca textual, os resultados mais relevantes vêm primeiro
    let orderBy = "m.sort_order ASC, l.name ASC";

    if (filters.text) {
        orderBy = `${FULLTEXT_MATCH} DESC, ${orderBy}`;
        params.push(filters.text);
    }

    const sql = `
        SELECT
            l.id,
            l.slug,
            l.name,
            l.side,
            l.region,
            l.area,
            l.utility_type,
            l.description,
            l.result_image_url,
            m.id AS map_id,
            m.name AS map_name,
            m.slug AS map_slug,
            m.is_free AS map_is_free
        FROM lineups l
        INNER JOIN maps m ON m.id = l.map_id
        WHERE ${conditions.join(" AND ")}
        ORDER BY ${orderBy}
    `;

    const [rows] = await database.query<LineupCardRow[]>(sql, params);

    return rows.map((lineup) => ({
        id: lineup.id,
        slug: lineup.slug,
        name: lineup.name,
        side: lineup.side,
        region: lineup.region,
        area: lineup.area,
        utilityType: lineup.utility_type,
        description: lineup.description,
        resultImageUrl: lineup.result_image_url,
        // Avisa o frontend para mostrar o cadeado 🔒 no card
        requiresPremium: !lineup.map_is_free,
        map: {
            id: lineup.map_id,
            name: lineup.map_name,
            slug: lineup.map_slug,
        },
    }));
}

// Linha completa: dados do card + dados de execução.
// O repository só busca; quem decide o que mostrar é o service.
export interface LineupDetailRow extends LineupCardRow {
    position: string | null;
    aim: string | null;
    click_type: string;
    movement: string;
    throw_technique: string;
    execution_media_key: string | null;
    execution_media_type: string | null;
}

export async function findLineupBySlug(mapSlug: string, lineupSlug: string) {
    const [rows] = await database.query<LineupDetailRow[]>(
        `SELECT
            l.id,
            l.slug,
            l.name,
            l.side,
            l.region,
            l.area,
            l.utility_type,
            l.description,
            l.result_image_url,
            l.position,
            l.aim,
            l.click_type,
            l.movement,
            l.throw_technique,
            l.execution_media_key,
            l.execution_media_type,
            m.id AS map_id,
            m.name AS map_name,
            m.slug AS map_slug,
            m.is_free AS map_is_free
        FROM lineups l
        INNER JOIN maps m ON m.id = l.map_id
        WHERE m.slug = ?
          AND l.slug = ?
          AND l.status = 'PUBLISHED'
          AND m.is_active = TRUE
        LIMIT 1`,
        [mapSlug, lineupSlug],
    );

    return rows[0] ?? null;
}