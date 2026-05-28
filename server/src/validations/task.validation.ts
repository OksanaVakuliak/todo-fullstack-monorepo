import mongoose from 'mongoose';
import { z } from 'zod';

const isValidTaskId = (value: unknown): value is string => {
  return typeof value === 'string' && mongoose.isValidObjectId(value);
};

export const getTasksSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(5).default(10),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(50, 'Title is too long'),
  content: z
    .string()
    .trim()
    .max(500, 'Content is too long')
    .optional()
    .default(''),
});

export const taskIdSchema = z.object({
  id: z.custom<string>(isValidTaskId, {
    message: 'Invalid id format',
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type GetTasksInput = z.infer<typeof getTasksSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
