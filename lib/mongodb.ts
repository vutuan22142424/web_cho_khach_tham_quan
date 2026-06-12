import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/Do_an_tot_nghiep';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log('✅ MongoDB connected');
}