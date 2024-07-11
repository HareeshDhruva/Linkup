import express from "express"
import { updateProfilePhoto, getAdmin} from "../controllers/userController.js";
import { protectRoute } from "../middleware/middleware.js";
const router = express.Router();

router.post("/update",protectRoute,updateProfilePhoto)
router.get("/",protectRoute,getAdmin)

export default router; 