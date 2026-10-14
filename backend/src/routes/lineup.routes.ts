
import { Router } from "express";
import { listLineups } from "../controllers/lineup.controller.js";

const lineupRoutes = Router();

lineupRoutes.get("/lineups", listLineups);

export default lineupRoutes;