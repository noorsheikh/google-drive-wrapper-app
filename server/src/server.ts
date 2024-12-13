import app from "./app";
import config from "./config";

const { PORT } = config;

app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});
