import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

void startServer();