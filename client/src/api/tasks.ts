import { api } from './axios';
import type {
  CreateTaskPayload,
  GetTasksParams,
  PaginatedTasksResponse,
  Task,
} from '../types/task';

export const getTasks = async (
  params: GetTasksParams = {}
): Promise<PaginatedTasksResponse> => {
  const { data } = await api.get<PaginatedTasksResponse>('/tasks', { params });
  return data;
};

export const getTask = async (id: string): Promise<Task> => {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { data } = await api.post<Task>('/tasks', payload);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
