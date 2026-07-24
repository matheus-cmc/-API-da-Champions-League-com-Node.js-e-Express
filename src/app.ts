import express from "express";
import path from "path";
import cors from "cors";
import router from "./routes";

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", router);

  const publicPath = path.join(__dirname, "..", "public");
  app.use(express.static(publicPath));

  return app;
}

export default createApp;
