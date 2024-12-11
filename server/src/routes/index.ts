import { Router } from "express";
import { userInfo } from "../controllers/user.controller";

const router = Router();

router.get("/user-info", userInfo);

export default router;
