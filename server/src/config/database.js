const mongoose = require("mongoose");

let connectionPromise;

const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  connectionPromise = mongoose
    .connect(uri, {
      dbName: process.env.DB_NAME || "RaghavEvents",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log(
        `MongoDB connected to ${process.env.DB_NAME || "RaghavEvents"}`,
      );
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = undefined;
      throw error;
    });

  return connectionPromise;
};

module.exports = { connectDatabase, mongoose };
