import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { initAuthEndpoint } from "./auth/auth";
import { initMongo } from "./mongo/init";
import { initTrackController } from "./trackController/track";

const conf = config().parsed;

const app = express();
app.use(cors({ origin: conf?.FRONTEND, credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("hi");
  res.send("Hello World!");
});

initAuthEndpoint(app);
initMongo();
initTrackController(app);

app.listen(parseInt(conf?.PORT || "5000"), conf?.HOST || "localhost", () => {
  console.log("started");
});
