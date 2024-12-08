import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/userinfo", (req: Request, res: Response) => {
  res.send("welcome here");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
