import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import mapRoutes from "./routes/map.routes.js";
import lineupRoutes from "./routes/lineup.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Só o endereço do nosso frontend pode chamar a API pelo navegador
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", mapRoutes);
app.use("/api", lineupRoutes);
app.use("/api", authRoutes);

export default app;