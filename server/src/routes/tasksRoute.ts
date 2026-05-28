import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
} from '../controllers/tasksController.js';
import {
  createTaskSchema,
  getTasksSchema,
  taskIdSchema,
} from '../validations/task.validation.js';

const router = Router();

router.get('/tasks', validate(getTasksSchema, 'query'), getAllTasks);
router.get('/tasks/:id', validate(taskIdSchema, 'params'), getTaskById);
router.post('/tasks', validate(createTaskSchema, 'body'), createTask);
router.delete('/tasks/:id', validate(taskIdSchema, 'params'), deleteTask);

export default router;
