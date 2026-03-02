import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";
import { redis } from "./config/redis.js";
import { createWebSocket } from "./websocket.js";

dotenv.config();

// Connect to MongoDB & Redis
connectMongo();

const server = http.createServer(app);
createWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running on port", PORT));