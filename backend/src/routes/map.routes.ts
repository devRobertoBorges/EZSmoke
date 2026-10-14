
import { Router } from "express";
import { listMaps } from "../controllers/map.controller.js";

const mapRoutes = Router();

mapRoutes.get("/maps", listMaps);

export default mapRoutes;