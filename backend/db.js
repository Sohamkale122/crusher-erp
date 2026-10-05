import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export let isMongoConnected = false;

// In-Memory store for instant zero-dependency launch and offline capability
export const memoryStore = {
  users: [],
  inventories: [],
  dispatches: [],
  employees: [],
  machineries: []
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crusher_erp';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`\x1b[32m✔ [Database] Successfully connected to MongoDB at ${uri}\x1b[0m`);
  } catch (err) {
    isMongoConnected = false;
    console.log(`\x1b[33m⚡ [Database] Local MongoDB not reachable (${err.message}).`);
    console.log(`✔ [Database] Auto-switching to High-Performance In-Memory Data Engine with live seeded datasets.\x1b[0m`);
  }
};
