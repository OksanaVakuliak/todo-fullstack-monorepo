import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { createTask, getAllTasks } from '../controllers/tasksController.js';
import {
  createTaskSchema,
  getTasksSchema,
} from '../validations/task.validation.js';

const router = Router();

router.get('/tasks', validate(getTasksSchema, 'query'), getAllTasks);
router.post('/tasks', validate(createTaskSchema, 'body'), createTask);

export default router;
