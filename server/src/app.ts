import express from 'express';
import cors from 'cors';
import tasksRoute from './routes/tasksRoute.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(tasksRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
