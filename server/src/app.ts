import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import config from "./config";

const { CORS_ORIGIN } = config;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

export default app;
