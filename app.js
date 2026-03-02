import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/auth", authRoutes);

export default app;