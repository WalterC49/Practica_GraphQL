import { connect } from "mongoose";
import { MONGO_URI } from "./env.js";

export const connectDB = () => {
  console.log("Connecting to", MONGO_URI);

  connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB.");
    })
    .catch((error) => {
      console.log("Error to connect to MongoDB:", error.message);
    });
};
