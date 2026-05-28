import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  createTask,
  deleteTask,
  getAllTasks,
} from '../controllers/tasksController.js';
import {
  createTaskSchema,
  getTasksSchema,
  taskIdSchema,
} from '../validations/task.validation.js';

const router = Router();

router.get('/tasks', validate(getTasksSchema, 'query'), getAllTasks);
router.post('/tasks', validate(createTaskSchema, 'body'), createTask);
router.delete('/tasks/:id', validate(taskIdSchema, 'params'), deleteTask);

export default router;
