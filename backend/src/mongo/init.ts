import { config } from "dotenv";
import mongoose, { Schema } from "mongoose";

config();
const connectionString = process.env.MONGO_CONNECTION_STRING;
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
  trackFileId: Schema.Types.ObjectId,
  folder: String,
});

export const User = mongoose.model("User", userSchema, "User");
export const Track = mongoose.model("Track", trackSchema, "Track");

type TrackFileId = InstanceType<typeof mongoose.mongo.ObjectId>;

export interface TrackAudio {
  track?: Buffer | null;
  trackFileId?: TrackFileId | null;
}

const getTrackBucket = () => {
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB is not connected");
  return new mongoose.mongo.GridFSBucket(database, { bucketName: "TrackAudio" });
};

export const storeTrackAudio = (
  filename: string,
  data: Buffer
): Promise<TrackFileId> =>
  new Promise((resolve, reject) => {
    const stream = getTrackBucket().openUploadStream(filename);
    stream.once("error", reject);
    stream.once("finish", () => resolve(stream.id));
    stream.end(data);
  });

export const getTrackAudioStream = (id: TrackFileId) =>
  getTrackBucket().openDownloadStream(id);

export const readTrackAudio = async (track: TrackAudio): Promise<Buffer> => {
  if (track.track) return track.track;
  if (!track.trackFileId) throw new Error("Track audio is missing");

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = getTrackAudioStream(track.trackFileId!);
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.once("error", reject);
    stream.once("end", () => resolve(Buffer.concat(chunks)));
  });
};

export const deleteTrackAudio = (id: TrackFileId) =>
  getTrackBucket().delete(id);

export const initMongo = async () => {
  if (!connectionString) {
    throw new Error("MONGO_CONNECTION_STRING is not configured");
  }

  await mongoose.connect(connectionString, { dbName: "McSiMusic" });
  console.log("mongodb connection established");
};
