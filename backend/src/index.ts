import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { initAuthEndpoint } from "./auth/auth";
import { initMongo } from "./mongo/init";
import { initTrackController } from "./controllers/track";
import { urlencoded } from "express";
import { initFolderController } from "./controllers/folder";
import { initActionsController } from "./controllers/actions";

config();
const conf = process.env;

const app = express();
app.use(cors({ origin: conf?.FRONTEND, credentials: true }));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const start = async () => {
  await initMongo();

  initAuthEndpoint(app);
  initTrackController(app);
  initFolderController(app);
  initActionsController(app);

  const server = app.listen(
    parseInt(conf?.PORT || "5000"),
    conf?.HOST || "localhost",
    () => {
      console.log("started");
    }
  );

  server.keepAliveTimeout = 30 * 1000;
  server.headersTimeout = 35 * 1000;
};

start().catch((error: unknown) => {
  console.error("Backend startup failed", error);
  process.exitCode = 1;
});
