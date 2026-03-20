import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteDataRouter from "./siteData";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(siteDataRouter);
router.use(uploadRouter);

export default router;
