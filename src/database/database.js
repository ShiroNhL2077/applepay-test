import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

mongoose.Promise = global.Promise;

async function connectDatabase() {
  await mongoose
    .connect(`${DB_URL}${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: {
        w: "majority",
      },
    })
    .then(() => {
      console.log(`Connected to database [${DB_NAME}]`);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function disconnectDatabase() {
  await mongoose
    .disconnect(`${DB_URL}${DB_NAME}`)
    .then(() => {
      console.log(`Disconnected from database [${DB_NAME}]`);
    })
    .catch((err) => {
      console.log(err);
    });
}

export { connectDatabase, disconnectDatabase };
