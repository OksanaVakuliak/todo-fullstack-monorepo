import { useState, type FormEvent } from 'react';
import styles from './AddTaskForm.module.css';
import type { CreateTaskPayload } from '../../types/task';

type AddTaskFormProps = {
  onSubmit: (payload: CreateTaskPayload) => void;
  isSubmitting?: boolean;
};

export default function AddTaskForm({
  onSubmit,
  isSubmitting = false,
}: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
    });

    setTitle('');
    setContent('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Create task</p>
          <h2>Add a new item</h2>
        </div>
        <p className={styles.hint}>Title is required</p>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Title</span>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you want to do?"
          maxLength={50}
          required
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Content</span>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Optional details"
          maxLength={500}
          rows={4}
        />
      </label>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create task'}
      </button>
    </form>
  );
}
