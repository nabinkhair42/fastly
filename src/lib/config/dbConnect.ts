import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB 🔥'); // emoji kept intentionally to identify easily in terminal
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
