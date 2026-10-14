
import {
    findAllLineups,
    type LineupFilters,
} from "../repositories/lineup.repository.js";

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