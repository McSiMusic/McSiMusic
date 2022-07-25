import { config } from "dotenv";
import mongoose, { Schema, Types } from "mongoose";
import { Howl } from "howler";
import path from "path";
import { parseFile } from "music-metadata";
import { readFile } from "fs/promises";

const connectionString = config().parsed?.MONGO_CONNECTION_STRING!;
const userSchema = new Schema({
  name: String,
  id: String,
  picture: String,
});

const trackSchema = new Schema({
  name: String,
  duration: Number,
  id: String,
  userId: String,
  track: Buffer,
});

export const User = mongoose.model("User", userSchema, "User");
export const Track = mongoose.model("Track", trackSchema, "Track");

export const initMongo = async () => {
  const connection = mongoose
    .connect(connectionString, { dbName: "McSiMusic" })
    .then(async () => {
      console.log("mongodb connection established");

      /* const name = path.join(__dirname, "Polupritsep.mp3");
      const res = await parseFile(name, {
        duration: true,
        skipCovers: true,
      });
      const buffer = await readFile(name);
      new Track({
        duration: res.format.duration,
        id: new mongoose.Types.ObjectId(),
        name: res.common.title,
        track: buffer,
        userId: new mongoose.Types.ObjectId("62da5356f9ddedbb4d3c03dd"),
      }).save(); */
    });
};
