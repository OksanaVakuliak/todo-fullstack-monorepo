import styles from './TaskList.module.css';
import type { Task } from '../../types/task';
import TaskItem from '../TaskItem/TaskItem';

type TaskListProps = {
  tasks: Task[];
  onViewDetails: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskList({
  tasks,
  onViewDetails,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No tasks yet</h2>
        <p>Once the API returns data, the list will appear here.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map(task => (
        <li key={task._id} className={styles.listItem}>
          <TaskItem
            task={task}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
