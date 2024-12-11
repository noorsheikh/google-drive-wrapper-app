import { Router } from "express";
import { userInfo } from "../controllers/user-info.controller";
import listFiles from "../controllers/list-files.controller";

const router = Router();

router.get("/user-info", userInfo);
router.get("/list-files", listFiles);

export default router;
