import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import type { Server as SocketIOServer } from "socket.io";
import { createRouter } from "./routes";

export function createApp(io: SocketIOServer): Express {
  const app: Express = express();

  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use(session({
    secret: process.env["SESSION_SECRET"] || "tout-lissie-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  }));

  app.use(express.static(path.resolve(process.cwd(), "public")));

  app.use("/api", createRouter(io));

  return app;
}
