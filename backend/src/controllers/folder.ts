import { Express } from "express";
import { Track, User } from "../mongo/init";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../auth/auth";
import { config } from "dotenv";
import { oauth2_v2 } from "googleapis";
const conf = config().parsed;

export const initFolderController = (express: Express) => {
  express.post("/folder", async (req, res) => {
    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const user = await User.findOne({ id: userInfo.id });
    if (user) {
      user.folders = [...user.folders, req.body.folder];
      const result = await user.save();
      res.send(result.folders);
      return;
    }

    res.sendStatus(404);
  });

  express.delete("/folder", async (req, res) => {
    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const user = await User.findOne({ id: userInfo.id });
    if (user) {
      user.folders = user.folders.filter((f) => f !== req.body.folder);
      await Track.deleteMany({ folder: req.body.folder });
      return res.send((await user.save()).folders);
    }

    res.sendStatus(404);
  });

  express.patch("/folder", async (req, res) => {
    const userInfo = jwt.verify(
      req.cookies[COOKIE_NAME],
      conf?.JWT_SECRET || "SECRET"
    ) as oauth2_v2.Schema$Userinfo;

    const user = await User.findOne({ id: userInfo.id });
    const { folder, oldFolder } = req.body;
    if (user) {
      const folderIndex = user.folders.findIndex((f) => f === oldFolder);
      user.folders[folderIndex] = folder;
      return res.send((await user.save()).folders);
    }

    res.sendStatus(404);
  });
};
