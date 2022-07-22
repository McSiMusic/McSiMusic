import { config } from "dotenv";
import mongoose, { Schema } from "mongoose";

const connectionString = config().parsed?.MONGO_CONNECTION_STRING!;
const userSchema = new Schema({
  name: String,
});

export const initMongo = async () => {
  const connection = mongoose
    .connect(connectionString, { dbName: "McSiMusic" })
    .then(() => {
      console.log("mongodb connection established");
    });

  const MyModel = mongoose.model("User", userSchema, "User");
  MyModel.find({}, (err: unknown, data: unknown) => console.log(data));

  const user = new MyModel({ name: "McSim" });
  user.save();
};
