import { Express } from "express";
import { Track } from "../mongo/init";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../auth/auth";
import { config } from "dotenv";
import { oauth2_v2 } from "googleapis";
import { parseStream } from "music-metadata";
import mongoose from "mongoose";
import path from "path";
const conf = config().parsed;

export const initTrackController = (express: Express) => {
  express.get("/tracks", async (req, res) => {
    const result = await Track.find({}).select({ track: 0 }).clone();
    res.send(result);
    res.end();
  });

  express.get("/track/id", async (req, res) => {
    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const track = await Track.findOne({ id: userInfo.id });
    res.send(track?.track);
  });

  express.post("/track", async (req, res) => {
    const file = req.file;
    if (file === undefined) return res.send(400);

    const stream = file.stream;
    const audioMeta = await parseStream(stream);
    const chunks = [];
    for await (let chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const result = await new Track({
      duration: audioMeta.format.duration,
      id: new mongoose.Types.ObjectId(),
      name: audioMeta.common.title || path.basename(file.filename),
      track: buffer,
      userId: new mongoose.Types.ObjectId("62da5356f9ddedbb4d3c03dd"),
    }).save();

    res.send(result);
  });
};
