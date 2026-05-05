import { Router } from "express";
import { RagController } from "./rag.controller";
import auth, { UserRole } from "../../../middlewares/auth";

const router = Router();

// RAG endpoints (subscriptions-scoped)
router.get("/stats", auth(UserRole.ADMIN), RagController.getStats);
router.post("/ingest", auth(UserRole.ADMIN), RagController.ingestSubscriptions);
router.post("/query", auth(UserRole.STUDENT, UserRole.ADMIN), RagController.queryRag);


export const RagRoutes = router;