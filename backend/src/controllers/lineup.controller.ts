
import type { Request, Response } from "express";
import { getAllLineups } from "../services/lineup.service.js";

function getQueryString(
    value: unknown,
): string | undefined | null {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value !== "string") {
        return null;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0
        ? trimmedValue
        : undefined;
}

export async function listLineups(req: Request, res: Response) {
    const map = getQueryString(req.query.map);
    const side = getQueryString(req.query.side);
    const region = getQueryString(req.query.region);
    const type = getQueryString(req.query.type);
    const search = getQueryString(req.query.search);

    const filters = [map, side, region, type, search];

    if (filters.some((value) => value === null)) {
        return res.status(400).json({
            success: false,
            message:
                "Os filtros devem conter apenas um valor de texto cada.",
        });
    }

    try {
        const lineups = await getAllLineups({
            map: map ?? undefined,
            side: side ?? undefined,
            region: region ?? undefined,
            type: type ?? undefined,
            search: search ?? undefined,
        });

        return res.status(200).json({
            success: true,
            data: lineups,
        });
    } catch (error) {
        if (error instanceof Error) {
            const invalidFilters: Record<string, string> = {
                INVALID_SIDE: "Lado inválido. Use TR ou CT.",
                INVALID_REGION: "Região inválida. Use A, B ou MID.",
                INVALID_TYPE:
                    "Tipo inválido. Use SMOKE, FLASH, MOLOTOV ou HE.",
            };

            const message = invalidFilters[error.message];

            if (message) {
                return res.status(400).json({
                    success: false,
                    message,
                });
            }
        }

        console.error("Erro ao listar lineups:", error);

        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar as lineups.",
        });
    }
}