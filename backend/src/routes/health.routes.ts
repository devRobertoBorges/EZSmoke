import { Router } from "express";

const healthRoutes = Router();

healthRoutes.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "EZSmoke API está funcionando!",
    });
});

export default healthRoutes;