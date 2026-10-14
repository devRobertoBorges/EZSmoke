
import { findAllMaps } from "../repositories/map.repository.js";

export async function getAllMaps() {
    return findAllMaps();
}