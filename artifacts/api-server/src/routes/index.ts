import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteDataRouter from "./siteData";
import uploadRouter from "./upload";
import contentRouter from "./content";
import adminRouter from "./admin";
import pixRouter from "./pix";

const router: IRouter = Router();

router.use(adminRouter);
router.use(contentRouter);
router.use(healthRouter);
router.use(pixRouter);
router.use(siteDataRouter);
router.use(uploadRouter);

export default router;
