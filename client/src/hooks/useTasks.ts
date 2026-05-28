import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import type { GetTasksParams } from '../types/task';

export const useTasks = ({
  page = 1,
  limit = 10,
  search = '',
}: GetTasksParams) => {
  return useQuery({
    queryKey: ['tasks', page, limit, search],
    queryFn: () => getTasks({ page, limit, search }),
  });
};
