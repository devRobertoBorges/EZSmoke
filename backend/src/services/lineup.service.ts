import {
    findAllLineups,
    findLineupBySlug,
    type LineupFilters,
} from "../repositories/lineup.repository.js";
import { userHasPremium } from "../repositories/premium.repository.js";
import { getExecutionMediaUrl } from "../integrations/media-storage.js";

const allowedSides = ["TR", "CT"];
const allowedRegions = ["A", "B", "MID"];
const allowedTypes = ["SMOKE", "FLASH", "MOLOTOV", "HE"];

export async function getAllLineups(filters: LineupFilters) {
    if (filters.side && !allowedSides.includes(filters.side.toUpperCase())) {
        throw new Error("INVALID_SIDE");
    }

    if (filters.region && !allowedRegions.includes(filters.region.toUpperCase())) {
        throw new Error("INVALID_REGION");
    }

    if (filters.type && !allowedTypes.includes(filters.type.toUpperCase())) {
        throw new Error("INVALID_TYPE");
    }

    return findAllLineups({
        ...filters,
        side: filters.side?.toUpperCase(),
        region: filters.region?.toUpperCase(),
        type: filters.type?.toUpperCase(),
        map: filters.map?.trim().toLowerCase(),
        search: filters.search?.trim(),
    });
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