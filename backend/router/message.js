import express from "express";
const router = express.Router();
import { sendMessage, getMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/middleware.js";

router.post("/send/:id",protectRoute,sendMessage); 
router.get("/:id",protectRoute,getMessage);

export default router;
