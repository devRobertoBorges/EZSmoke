
import type { Request, Response } from "express";
import { getAllMaps } from "../services/map.service.js";

export async function listMaps(_req: Request, res: Response) {
    try {
        const maps = await getAllMaps();

        return res.status(200).json({
            success: true,
            data: maps,
        });
    } catch (error) {
        console.error("Erro ao listar mapas:", error);

        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar os mapas.",
        });
    }
}