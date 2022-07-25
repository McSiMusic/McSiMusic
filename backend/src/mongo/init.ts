import { config } from "dotenv";
import mongoose, { Schema } from "mongoose";

const connectionString = config().parsed?.MONGO_CONNECTION_STRING!;
const userSchema = new Schema({
  name: String,
  id: String,
  picture: String,
  folders: [String],
});

const trackSchema = new Schema({
  name: String,
  duration: Number,
  id: String,
  userId: String,
  date: Number,
  track: Buffer,
});

export const User = mongoose.model("User", userSchema, "User");
export const Track = mongoose.model("Track", trackSchema, "Track");

export const initMongo = async () => {
  mongoose.connect(connectionString, { dbName: "McSiMusic" }).then(async () => {
    console.log("mongodb connection established");
  });
};
