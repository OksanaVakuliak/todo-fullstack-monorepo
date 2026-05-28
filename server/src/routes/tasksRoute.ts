import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { getAllTasks } from '../controllers/tasksController.js';
import { getTasksSchema } from '../validations/task.validation.js';

const router = Router();

router.get('/tasks', validate(getTasksSchema, 'query'), getAllTasks);

export default router;
