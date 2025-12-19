import mongoose from "mongoose";
const MONGOURL: string | undefined = process.env.MONGODB_URL;
if (!MONGOURL) {
  throw new Error("Error in Connecting with database ");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.conn) {
    cached.promise = mongoose.connect(MONGOURL).then((conn) => conn.connection);
  }
  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
