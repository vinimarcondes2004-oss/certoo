import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteDataRouter from "./siteData";
import adminRouter from "./admin";
import type { Server as SocketIOServer } from "socket.io";
import { createContentRouter } from "./content";

export function createRouter(io: SocketIOServer): IRouter {
  const router: IRouter = Router();

  router.use(healthRouter);
  router.use(siteDataRouter);
  router.use(adminRouter);
  router.use(createContentRouter(io));

  return router;
}
