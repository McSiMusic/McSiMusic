import { Express } from "express";
import { Track, User } from "../mongo/init";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../auth/auth";
import { config } from "dotenv";
import { oauth2_v2 } from "googleapis";
import { getBpm } from "./bpm";
const conf = config().parsed;

export const initActionsController = (express: Express) => {
  express.get("/bpm", async (req, res) => {
    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const trackId = req.query.trackId;
    const track = (await Track.findById(trackId))?.track;

    res.send(await getBpm(track!));
  });
};
