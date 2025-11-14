import mongoose from 'mongoose';

declare global {
  var _mongoose: Promise<typeof mongoose> | null;
}

const cachedConnection = global._mongoose ?? null;

const connect = async () => {
  if (!cachedConnection) {
    global._mongoose = mongoose
      .connect(process.env.MONGODB_URI as string, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then(connection => {
        console.log('Connected to MongoDB 🔥');
        return connection;
      })
      .catch(error => {
        global._mongoose = null;
        console.error('MongoDB connection error', error);
        throw error;
      });
  }

  return global._mongoose as Promise<typeof mongoose>;
};

const dbConnect = async () => {
  return connect();
};

export default dbConnect;
