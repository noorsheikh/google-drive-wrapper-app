import { Router, Request, Response } from "express";

const router = Router();

router.get("/hello", (req: Request, res: Response) => {
  res.status(200).json({ hello: "Noor" });
});

export default router;
