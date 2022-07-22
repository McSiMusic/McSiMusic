import { config } from "dotenv";
import mongoose, { Schema } from "mongoose";

const connectionString = config().parsed?.MONGO_CONNECTION_STRING!;
const userSchema = new Schema({
  name: String,
  id: String,
  picture: String,
});
export const User = mongoose.model("User", userSchema, "User");

export const initMongo = async () => {
  const connection = mongoose
    .connect(connectionString, { dbName: "McSiMusic" })
    .then(() => {
      console.log("mongodb connection established");
    });
};
