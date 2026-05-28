import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { getTask } from '../../api/tasks';
import styles from './TaskModal.module.css';

type TaskModalProps = {
  taskId: string;
  onClose: () => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

export default function TaskModal({ taskId, onClose }: TaskModalProps) {
  const { data: task, isLoading, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(taskId),
    enabled: Boolean(taskId),
  });

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>

        {isLoading ? (
          <p className={styles.state}>Loading task details...</p>
        ) : isError ? (
          <p className={styles.state}>
            Failed to load task.
            {error instanceof Error ? ` ${error.message}` : ''}
          </p>
        ) : task ? (
          <div className={styles.content}>
            <p className={styles.eyebrow}>Task details</p>
            <h2 id="task-modal-title" className={styles.title}>
              {task.title}
            </h2>
            <dl className={styles.meta}>
              <div>
                <dt>Created</dt>
                <dd>{formatDate(task.createdAt)}</dd>
              </div>
              <div>
                <dt>Task ID</dt>
                <dd>{task._id}</dd>
              </div>
            </dl>
            <p className={styles.body}>
              {task.content ? task.content : 'No additional details'}
            </p>
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
