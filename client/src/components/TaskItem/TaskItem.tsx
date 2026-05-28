import styles from './TaskItem.module.css';
import type { Task } from '../../types/task';

type TaskItemProps = {
  task: Task;
  onViewDetails: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export default function TaskItem({
  task,
  onViewDetails,
  onDelete,
}: TaskItemProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.label}>Task</p>
          <h3 className={styles.title}>{task.title}</h3>
        </div>

        <time className={styles.date} dateTime={task.createdAt}>
          {formatDate(task.createdAt)}
        </time>
      </div>

      {task.content ? (
        <p className={styles.content}>{task.content}</p>
      ) : (
        <p className={styles.placeholder}>No additional details</p>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.detailsButton}
          onClick={() => onViewDetails(task._id)}
        >
          View details
        </button>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
