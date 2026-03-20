import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app";
import { migrate } from "@workspace/db";
import { ensureContentTable } from "./lib/supabaseMigrate";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = http.createServer();

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/api/socket.io",
});

const app = createApp(io);
httpServer.on("request", app);

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

migrate()
  .then(() => ensureContentTable())
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Socket.io running at /api/socket.io`);
    });
  })
  .catch((err) => {
    console.error("Failed to run migrations:", err);
    process.exit(1);
  });
