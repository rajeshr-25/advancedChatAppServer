import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { redis } from "./config/redis.js";
import Message from "./models/Message.js";
import { v4 as uuid } from "uuid";

export function createWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const token = req.url.split("token=")[1];
    if (!token) return ws.close();

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return ws.close();
    }

    // Mark user online
    await redis.hSet("onlineUsers", user.userId, user.username);
    broadcastOnlineUsers();

    ws.on("message", async (raw) => {
      const data = JSON.parse(raw);

      // ------- SEND MESSAGE -------
      if (data.type === "message") {
        const msg = {
          messageId: uuid(),
          roomId: data.roomId,
          userId: user.userId,
          username: user.username,
          text: data.text,
          createdAt: new Date()
        };

        await Message.create(msg);
        broadcastToAll({ type: "message", msg });
      }

      // ------- TYPING INDICATOR -------
      if (data.type === "typing") {
        broadcastToAll({
          type: "typing",
          username: user.username,
          userId: user.userId
        });
      }
    });

    ws.on("close", async () => {
      await redis.hDel("onlineUsers", user.userId);
      broadcastOnlineUsers();
    });

    function broadcastOnlineUsers() {
      redis.hGetAll("onlineUsers").then((users) => {
        broadcastToAll({ type: "online_users", users });
      });
    }

    function broadcastToAll(data) {
      const payload = JSON.stringify(data);
      wss.clients.forEach((c) => {
        if (c.readyState === 1) c.send(payload);
      });
    }
  });
}