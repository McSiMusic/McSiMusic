import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND }));

app.get("/", (req, res) => {
  console.log("hi");
  res.send("Hello World!");
});

app.listen(
  parseInt(process.env.PORT || "5000"),
  process.env.HOST || "localhost",
  () => {
    console.log("started");
  }
);
