import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config";
import router from "./routes";

const { CORS_ORIGIN } = config;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);
app.use("/api", router);

export default app;
