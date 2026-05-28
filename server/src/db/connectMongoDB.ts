import mongoose from 'mongoose';
import { Task } from '../models/task.js';

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await Task.syncIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
