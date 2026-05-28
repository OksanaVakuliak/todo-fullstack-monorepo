import { useTasks } from '../../hooks/useTasks';
import TaskList from '../TaskList/TaskList';
import styles from './App.module.css';

export default function App() {
  const { data, isLoading, isError, error } = useTasks({
    page: 1,
    limit: 10,
    search: '',
  });

  const tasks = data?.tasks ?? [];
  const totalTasks = data?.totalTasks ?? 0;

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
          <TaskList tasks={tasks} />
        )}
      </section>
    </main>
  );
}
