import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

export default config;
