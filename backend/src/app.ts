
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import mapRoutes from "./routes/map.routes.js";
import lineupRoutes from "./routes/lineup.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", mapRoutes);
app.use("/api", lineupRoutes);
app.use("/api", authRoutes);


export default app;