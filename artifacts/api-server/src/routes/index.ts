import { Router, type IRouter } from "express";
import healthRouter from "./health";
import siteDataRouter from "./siteData";
import uploadRouter from "./upload";
import contentRouter from "./content";
import adminRouter from "./admin";
import stripeRouter from "./stripe";

const router: IRouter = Router();

router.use(adminRouter);
router.use(contentRouter);
router.use(healthRouter);
router.use(siteDataRouter);
router.use(uploadRouter);
router.use(stripeRouter);

export default router;
