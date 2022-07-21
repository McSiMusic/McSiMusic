import express from "express";
import { config } from "dotenv";

config();

const app = express();
app.get("/", (req, res) => {
  console.log("hi");
  res.send("Hello World!");
});

app.listen(
  parseInt(process.env.PORT || "8082"),
  process.env.HOST || "localhost",
  () => {
    console.log("started");
  }
);
