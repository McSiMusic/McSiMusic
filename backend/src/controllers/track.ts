import { Express } from "express";
import {
  deleteTrackAudio,
  getTrackAudioStream,
  readTrackAudio,
  storeTrackAudio,
  Track,
} from "../mongo/init";
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
    if (!track) return res.sendStatus(404);

    res.header("Accept-Ranges", "bytes");

    if (track.track) return res.send(track.track);
    if (!track.trackFileId) return res.sendStatus(404);

    const stream = getTrackAudioStream(track.trackFileId);
    stream.once("error", (error) => {
      console.error("Failed to stream track audio", error);
      if (!res.headersSent) res.sendStatus(404);
      else res.destroy(error);
    });
    stream.pipe(res);
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

    try {
      const result = [];
      for (const file of files) {
        const audioMeta = await parseBuffer(file.buffer);
        const name = Buffer.from(
          audioMeta.common.title || path.basename(file.originalname),
          "latin1"
        ).toString("utf8");
        const trackFileId = await storeTrackAudio(file.originalname, file.buffer);

        try {
          result.push(
            await new Track({
              duration: audioMeta.format.duration,
              id: new mongoose.Types.ObjectId(),
              name,
              trackFileId,
              userId: userInfo.id!,
              date: new Date(),
              folder,
            }).save()
          );
        } catch (error) {
          await deleteTrackAudio(trackFileId);
          throw error;
        }
      }

      res.send(result);
    } catch (error) {
      console.error("Track upload failed", error);
      res.status(500).json({ message: "Failed to process the uploaded audio." });
    }
  });

  express.delete("/track", async (req, res) => {
    jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const trackId = req.query.trackId;
    const track = await Track.findById(trackId);
    if (track?.trackFileId) await deleteTrackAudio(track.trackFileId);
    if (track) await track.remove();

    res.send();
  });
};
