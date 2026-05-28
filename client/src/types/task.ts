export type Task = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateTaskPayload = {
  title: string;
  content?: string;
};

export type GetTasksParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginatedTasksResponse = {
  page: number;
  limit: number;
  totalPages: number;
  totalTasks: number;
  tasks: Task[];
};
