import {
    findAllLineups,
    findLineupBySlug,
} from "../repositories/lineup.repository.js";
import { findAllMaps } from "../repositories/map.repository.js";
import { userHasPremium } from "../repositories/premium.repository.js";
import { getExecutionMediaUrl } from "../integrations/media-storage.js";
import {
    normalizeText,
    parseSearch,
    toFullTextQuery,
} from "../utils/search-parser.js";

const allowedSides = ["TR", "CT"];
const allowedRegions = ["A", "B", "MID"];
const allowedTypes = ["SMOKE", "FLASH", "MOLOTOV", "HE"];

// O que o controller envia (vindo da URL)
export interface LineupSearchInput {
    map?: string;
    side?: string;
    region?: string;
    type?: string;
    search?: string;
}

// Nomes de mapa que a busca reconhece, a partir do banco.
// "Dust II" → "dust" e "dust2". Mapas novos entram sozinhos.
async function getMapAliases() {
    const maps = await findAllMaps();
    const aliases = new Map<string, string>();

    for (const map of maps) {
        aliases.set(map.slug, map.slug);

        const firstWord = normalizeText(map.name).split(/[^a-z0-9]+/)[0];
        if (firstWord) {
            aliases.set(firstWord, map.slug);
        }
    }

    return aliases;
}

export async function getAllLineups(input: LineupSearchInput) {
    if (input.side && !allowedSides.includes(input.side.toUpperCase())) {
        throw new Error("INVALID_SIDE");
    }

    if (input.region && !allowedRegions.includes(input.region.toUpperCase())) {
        throw new Error("INVALID_REGION");
    }

    if (input.type && !allowedTypes.includes(input.type.toUpperCase())) {
        throw new Error("INVALID_TYPE");
    }

    let map = input.map?.trim().toLowerCase() || undefined;
    let side = input.side?.toUpperCase();
    let region = input.region?.toUpperCase();
    let type = input.type?.toUpperCase();
    let text: string | undefined;

    const search = input.search?.trim();

    if (search) {
        const parsed = parseSearch(search, await getMapAliases());

        // Filtros escolhidos nos botões têm prioridade sobre os detectados no texto
        map ??= parsed.map;
        side ??= parsed.side;
        region ??= parsed.region;
        type ??= parsed.type;

        text = toFullTextQuery(parsed.words);
    }

    return findAllLineups({ map, side, region, type, text });
}

export async function getLineupDetail(
    mapSlug: string,
    lineupSlug: string,
    userId?: number,
) {
    const lineup = await findLineupBySlug(
        mapSlug.trim().toLowerCase(),
        lineupSlug.trim().toLowerCase(),
    );

    if (!lineup) {
        throw new Error("LINEUP_NOT_FOUND");
    }

    // ===== Regra de acesso Premium (único lugar onde ela existe) =====
    const mapIsFree = Boolean(lineup.map_is_free);
    const hasAccess =
        mapIsFree ||
        (userId !== undefined && (await userHasPremium(userId)));

    // Dados do card: qualquer pessoa pode ver
    const card = {
        id: lineup.id,
        slug: lineup.slug,
        name: lineup.name,
        side: lineup.side,
        region: lineup.region,
        area: lineup.area,
        utilityType: lineup.utility_type,
        description: lineup.description,
        resultImageUrl: lineup.result_image_url,
        requiresPremium: !mapIsFree,
        map: {
            id: lineup.map_id,
            name: lineup.map_name,
            slug: lineup.map_slug,
        },
    };

    // Sem acesso: devolve só o card. Os dados de execução nem saem daqui.
    if (!hasAccess) {
        return {
            ...card,
            locked: true,
            execution: null,
        };
    }

    return {
        ...card,
        locked: false,
        execution: {
            position: lineup.position,
            aim: lineup.aim,
            clickType: lineup.click_type,
            movement: lineup.movement,
            throwTechnique: lineup.throw_technique,
            mediaUrl: getExecutionMediaUrl(lineup.execution_media_key),
            mediaType: lineup.execution_media_type,
        },
    };
}