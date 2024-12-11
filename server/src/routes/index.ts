import { Router } from "express";
import { userInfo } from "../controllers/user-info.controller";

const router = Router();

router.get("/user-info", userInfo);

export default router;
