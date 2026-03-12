import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common";
import { prisma } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    if (!decoded || !decoded.userId) return null;
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (userId === null) {
    ws.close();
    return;
  }

  console.log("User connected:", userId);
  users.push({ userId, rooms: [], ws });

  ws.on("message", async (data) => {
    let parsedData;
    try {
      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString());
      } else {
        parsedData = JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to parse message:", e);
      return;
    }


    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) return;
      user.rooms.push(String(parsedData.roomId));
      console.log("User joined room:", parsedData.roomId);
      console.log("User rooms:", user.rooms);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter(x => x !== String(parsedData.roomId));
      console.log("User left room:", parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = String(parsedData.roomId);
      const message = parsedData.message;


      try {
        await prisma.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId: Number(userId)
          }
        });
       
      } catch (e) {
        console.error("DB error:", e);
      }

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message,
            roomId
          }));
       
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("User disconnected:", userId);
    users.splice(users.findIndex(x => x.ws === ws), 1);
  });
});

console.log("WebSocket server running on port 8080");