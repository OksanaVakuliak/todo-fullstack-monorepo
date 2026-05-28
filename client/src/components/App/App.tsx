import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask } from '../../api/tasks';
import { useTasks } from '../../hooks/useTasks';
import AddTaskForm from '../AddTaskForm/AddTaskForm';
import TaskPagination from '../TaskPagination/TaskPagination';
import TaskModal from '../TaskModal/TaskModal';
import TaskSearch from '../TaskSearch/TaskSearch';
import TaskList from '../TaskList/TaskList';
import styles from './App.module.css';

export default function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useTasks({
    page,
    limit: 5,
    search,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async (_data, taskId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tasks'] }),
        queryClient.removeQueries({ queryKey: ['task', taskId] }),
      ]);

      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const tasks = data?.tasks ?? [];
  const totalTasks = data?.totalTasks ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const handleViewDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handlePageChange = (nextPage: number) => {
    setSelectedTaskId(null);
    setPage(nextPage);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);

    if (tasks.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  const handleCreateTask = (payload: { title: string; content?: string }) => {
    createTaskMutation.mutate(payload);
  };

  return (
    <main className={styles.app}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Todo List</p>
        <h1>Tasks in one place</h1>
        <p className={styles.lead}>
          Task data is now wired into the app through React Query and Axios.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalTasks}</span>
            <span className={styles.statLabel}>Stored tasks</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{data?.totalPages ?? 0}</span>
            <span className={styles.statLabel}>Pages</span>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <AddTaskForm
          onSubmit={handleCreateTask}
          isSubmitting={createTaskMutation.isPending}
        />
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.panelLabel}>Task feed</p>
            <h2>Latest items</h2>
          </div>
          <span className={styles.panelMeta}>{tasks.length} shown</span>
        </div>

        <div className={styles.filters}>
          <TaskSearch value={search} onChange={handleSearchChange} />
          <p className={styles.panelMeta}>
            {totalTasks} total{' '}
            {totalPages > 0 ? `· page ${page} of ${totalPages}` : ''}
          </p>
        </div>

        {isLoading ? (
          <p className={styles.state}>Loading tasks...</p>
        ) : isError ? (
          <p className={styles.state}>
            Failed to load tasks.
            {error instanceof Error ? ` ${error.message}` : ''}
          </p>
        ) : (
          <TaskList
            tasks={tasks}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteTask}
          />
        )}

        <TaskPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>

      {selectedTaskId ? (
        <TaskModal
          taskId={selectedTaskId}
          onClose={handleCloseModal}
          onDelete={handleDeleteTask}
        />
      ) : null}
    </main>
  );
}
