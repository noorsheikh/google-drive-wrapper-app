import { Router } from "express";
import multer from "multer";

import userInfo from "../controllers/user-info.controller";
import listFiles from "../controllers/list-files.controller";
import uploadFile from "../controllers/upload-file.controller";
import removeFile from "../controllers/remove-file.controller";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.get("/user-info", userInfo);
router.get("/list-files", listFiles);
router.post("/upload-file", upload.single("file"), uploadFile);
router.get("/remove-file", removeFile);

export default router;
