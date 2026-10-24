import { Router, type IRouter } from "express";
import healthRouter from "./health";
import workoutsRouter from "./workouts";
import coachRouter from "./coach";

const router: IRouter = Router();

router.use(healthRouter);
router.use(workoutsRouter);
router.use(coachRouter);

export default router;
