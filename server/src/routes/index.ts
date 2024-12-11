import { Router } from "express";
import { userInfo } from "../controllers/user-info.controller";
import listFiles from "../controllers/list-files.controller";
import removeFile from "../controllers/remove-file.controller";

const router = Router();

router.get("/user-info", userInfo);
router.get("/list-files", listFiles);
router.get("/remove-file", removeFile);

export default router;
