import { Express } from "express";
import { Track, User } from "../mongo/init";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../auth/auth";
import { config } from "dotenv";
import { oauth2_v2 } from "googleapis";
import { parseBuffer } from "music-metadata";
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
const conf = config().parsed;

export const initTrackController = (express: Express) => {
  express.get("/tracks", async (req, res) => {
    const folder = req.query.folder;
    const filter = req.query.filter || "";
    const offset = parseInt(req.query.offset?.toString() || "0");
    const size = parseInt(req.query.size?.toString() || "10");
    const sort = req.query.sort?.toString() || "name";
    const order = (req.query.order?.toString() || "asc") as "asc" | "desc";

    if (folder === undefined) {
      return res.send(400);
    }

    const result = await Track.find({
      folder: folder,
      name: { $regex: filter, $options: "i" },
    })
      .select({ track: 0 })
      .skip(offset)
      .limit(size)
      .sort({ [sort]: order })
      .allowDiskUse(true)
      .exec();

    res.send(result);
  });

  express.get("/track", async (req, res) => {
    jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const trackId = req.query.trackId;
    const track = await Track.findById(trackId);

    res.header("Accept-Ranges", "bytes");

    res.send(track?.track);
  });

  express.get("/track/metadata", async (req, res) => {
    jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const trackId = req.query.trackId;
    const track = await Track.findById(trackId).select({ track: 0 });

    res.send(track);
  });

  express.post("/tracks", multer().array("files"), async (req, res) => {
    const folder = req.query.folder;
    if (folder === undefined) {
      return res.send(400);
    }

    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const files = req.files as Express.Multer.File[];
    if (files === undefined) return res.send(400);

    const result = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const audioMeta = await parseBuffer(file.buffer);

      const name = Buffer.from(
        audioMeta.common.title || path.basename(file.originalname),
        "latin1"
      ).toString("utf8");

      result.push(
        await new Track({
          duration: audioMeta.format.duration,
          id: new mongoose.Types.ObjectId(),
          name,
          track: file.buffer,
          userId: userInfo.id!,
          date: new Date(),
          folder,
        }).save()
      );
    }

    res.send(result);
  });

  express.delete("/track", async (req, res) => {
    jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const trackId = req.query.trackId;
    await Track.findById(trackId).remove();

    res.send();
  });
};
