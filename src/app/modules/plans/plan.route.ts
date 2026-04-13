import { Router } from "express";
// import { validate } from "../../middlewares/validate.middleware";
import { PlanController } from "./plan.controller";
import { createPlanSchema } from "./plan.validation";

import { validateRequest } from "../../../middlewares/validateRequest";
import auth, { UserRole } from "../../../middlewares/auth";


const router = Router();

router.get("/", PlanController.getPlans);
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(createPlanSchema),
  PlanController.createPlan
);

export const planRoutes: Router = router;