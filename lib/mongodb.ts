// import mongoose from 'mongoose';

// const MONGO_URI = 'mongodb://localhost:27017/Do_an_tot_nghiep';

// let isConnected = false;

// export async function connectDB() {
//   if (isConnected) return;
//   await mongoose.connect(MONGO_URI);
//   isConnected = true;
//   console.log('✅ MongoDB connected');
// }


import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose ?? { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}