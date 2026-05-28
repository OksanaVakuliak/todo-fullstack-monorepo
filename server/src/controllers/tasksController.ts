import { Request, Response } from 'express';
import { Task } from '../models/task.js';
import type { GetTasksInput } from '../validations/task.validation.js';

export const getAllTasks = async (
  req: Request<{}, {}, {}, unknown>,
  res: Response,
): Promise<void> => {
  const { page, limit, search } = res.locals.validated as GetTasksInput;

  const skip = (page - 1) * limit;

  const tasksQuery = Task.find();

  if (search) {
    tasksQuery.where({ $text: { $search: search } });
  }
  const [totalTasks, tasks] = await Promise.all([
    tasksQuery.clone().countDocuments(),
    tasksQuery.skip(skip).limit(Number(limit)),
  ]);

  const totalPages = Math.ceil(totalTasks / limit);

  res.status(200).json({
    page: Number(page),
    limit: Number(limit),
    totalPages,
    totalTasks,
    tasks,
  });
};

export const getTaskById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.status(200).json(task);
};

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

export const deleteTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  res.status(200).json({ message: 'Task deleted successfully' });
};
