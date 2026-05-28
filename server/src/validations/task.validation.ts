import { z } from 'zod';

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

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
