import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../../api/tasks';
import { useTasks } from '../../hooks/useTasks';
import TaskModal from '../TaskModal/TaskModal';
import TaskList from '../TaskList/TaskList';
import styles from './App.module.css';

export default function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useTasks({
    page: 1,
    limit: 10,
    search: '',
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

  const tasks = data?.tasks ?? [];
  const totalTasks = data?.totalTasks ?? 0;

  const handleViewDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
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
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.panelLabel}>Task feed</p>
            <h2>Latest items</h2>
          </div>
          <span className={styles.panelMeta}>{tasks.length} shown</span>
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
