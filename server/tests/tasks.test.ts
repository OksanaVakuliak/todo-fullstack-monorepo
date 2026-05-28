import request from 'supertest';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

type TaskRecord = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

type TasksSearchFilter = {
  $text: {
    $search: string;
  };
};

type TasksCountQuery = {
  countDocuments: () => Promise<number>;
};

type TasksFindQuery = {
  where: jest.MockedFunction<(filter: TasksSearchFilter) => TasksFindQuery>;
  clone: jest.MockedFunction<() => TasksCountQuery>;
  skip: jest.MockedFunction<(value: number) => TasksFindQuery>;
  limit: jest.MockedFunction<(value: number) => Promise<TaskRecord[]>>;
};

const taskId = '507f1f77bcf86cd799439011';

const makeTask = (overrides: Partial<TaskRecord> = {}): TaskRecord => ({
  _id: taskId,
  title: 'Task title',
  content: 'Task content',
  ...overrides,
});

const mockedTaskModel = {
  find: jest.fn() as jest.MockedFunction<() => TasksFindQuery>,
  create: jest.fn() as jest.MockedFunction<
    (task: { title: string; content?: string }) => Promise<TaskRecord>
  >,
  findById: jest.fn() as jest.MockedFunction<
    (id: string) => Promise<TaskRecord | null>
  >,
  findByIdAndDelete: jest.fn() as jest.MockedFunction<
    (id: string) => Promise<TaskRecord | null>
  >,
};

await jest.unstable_mockModule('../src/models/task.js', () => ({
  Task: mockedTaskModel,
}));

const { default: app } = await import('../src/app.js');

const buildFindQueryMock = (
  tasks: TaskRecord[],
  totalTasks: number,
): TasksFindQuery => {
  const countDocuments = jest.fn() as jest.MockedFunction<
    () => Promise<number>
  >;
  countDocuments.mockResolvedValue(totalTasks);

  const query: TasksFindQuery = {
    where: jest.fn() as jest.MockedFunction<
      (filter: TasksSearchFilter) => TasksFindQuery
    >,
    clone: jest.fn() as jest.MockedFunction<() => TasksCountQuery>,
    skip: jest.fn() as jest.MockedFunction<(value: number) => TasksFindQuery>,
    limit: jest.fn() as jest.MockedFunction<
      (value: number) => Promise<TaskRecord[]>
    >,
  };

  query.where.mockReturnValue(query);
  query.clone.mockReturnValue({
    countDocuments,
  });
  query.skip.mockReturnValue(query);
  query.limit.mockResolvedValue(tasks);

  return query;
};

const mockTasksFind = (tasks: TaskRecord[], totalTasks: number) => {
  const query = buildFindQueryMock(tasks, totalTasks);
  mockedTaskModel.find.mockReturnValue(query);
  return query;
};

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns paginated tasks for GET /tasks', async () => {
    const tasks = [makeTask({ title: 'Test task', content: 'Test content' })];
    const query = mockTasksFind(tasks, 1);

    const response = await request(app).get(
      '/tasks?page=1&limit=10&search=test',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      page: 1,
      limit: 10,
      totalPages: 1,
      totalTasks: 1,
      tasks,
    });
    expect(mockedTaskModel.find).toHaveBeenCalledTimes(1);
    expect(query.where).toHaveBeenCalledWith({ $text: { $search: 'test' } });
    expect(query.skip).toHaveBeenCalledWith(0);
    expect(query.limit).toHaveBeenCalledWith(10);
  });

  it('returns 400 for invalid GET /tasks query params', async () => {
    const response = await request(app).get('/tasks?page=0&limit=10');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(mockedTaskModel.find).not.toHaveBeenCalled();
  });

  it('creates a task for POST /tasks', async () => {
    const task = {
      ...makeTask({ title: 'New task', content: 'Task content' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockedTaskModel.create.mockResolvedValue(task);

    const response = await request(app).post('/tasks').send({
      title: 'New task',
      content: 'Task content',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(task);
    expect(mockedTaskModel.create).toHaveBeenCalledWith({
      title: 'New task',
      content: 'Task content',
    });
  });

  it('returns 400 for invalid POST /tasks body', async () => {
    const response = await request(app).post('/tasks').send({
      title: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(mockedTaskModel.create).not.toHaveBeenCalled();
  });

  it('returns a task for GET /tasks/:id', async () => {
    const task = makeTask({ title: 'Loaded task', content: 'Loaded content' });

    mockedTaskModel.findById.mockResolvedValue(task);

    const response = await request(app).get(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(task);
    expect(mockedTaskModel.findById).toHaveBeenCalledWith(taskId);
  });

  it('returns 404 when GET /tasks/:id does not find a task', async () => {
    mockedTaskModel.findById.mockResolvedValue(null);

    const response = await request(app).get(`/tasks/${taskId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Task not found');
  });

  it('returns 400 for invalid task id on DELETE /tasks/:id', async () => {
    const response = await request(app).delete('/tasks/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(mockedTaskModel.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('deletes a task for DELETE /tasks/:id', async () => {
    mockedTaskModel.findByIdAndDelete.mockResolvedValue(
      makeTask({ title: 'Deleted task', content: 'Deleted content' }),
    );

    const response = await request(app).delete(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Task deleted successfully',
    });
    expect(mockedTaskModel.findByIdAndDelete).toHaveBeenCalledWith(taskId);
  });
});
