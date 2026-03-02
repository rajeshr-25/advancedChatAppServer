import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";

const app = express();

app.use(cors({
  origin: [
    "https://advanced-chat-app-client.vercel.app",
    /\.vercel\.app$/,
    "http://localhost:5500",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());

// Public routes
app.use("/auth", authRoutes);

export default app;