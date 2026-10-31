import { Router } from "express";
import { listLineups, showLineup } from "../controllers/lineup.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const lineupRoutes = Router();

lineupRoutes.get("/lineups", listLineups);
lineupRoutes.get("/maps/:mapSlug/lineups/:slug", optionalAuth, showLineup);

export default lineupRoutes;