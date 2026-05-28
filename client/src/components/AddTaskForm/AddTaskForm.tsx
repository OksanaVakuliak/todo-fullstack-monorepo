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
  const [touched, setTouched] = useState({
    title: false,
    content: false,
  });

  const titleValue = title.trim();
  const contentValue = content.trim();

  const titleError =
    touched.title && !titleValue
      ? 'Title is required.'
      : titleValue.length > 50
        ? 'Title must be 50 characters or less.'
        : '';

  const contentError =
    touched.content && contentValue.length > 500
      ? 'Content must be 500 characters or less.'
      : '';

  const isFormValid = !titleError && !contentError && Boolean(titleValue);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ title: true, content: true });

    if (!isFormValid) {
      return;
    }

    onSubmit({
      title: titleValue,
      content: contentValue,
    });

    setTitle('');
    setContent('');
    setTouched({ title: false, content: false });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          className={`${styles.input} ${titleError ? styles.invalid : ''}`}
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          onBlur={() => setTouched(current => ({ ...current, title: true }))}
          placeholder="What do you want to do?"
          maxLength={50}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'task-title-error' : undefined}
        />
        {titleError ? (
          <span id="task-title-error" className={styles.error}>
            {titleError}
          </span>
        ) : null}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Content</span>
        <textarea
          className={`${styles.textarea} ${contentError ? styles.invalid : ''}`}
          value={content}
          onChange={event => setContent(event.target.value)}
          onBlur={() => setTouched(current => ({ ...current, content: true }))}
          placeholder="Optional details"
          maxLength={500}
          rows={4}
          aria-invalid={Boolean(contentError)}
          aria-describedby={contentError ? 'task-content-error' : undefined}
        />
        {contentError ? (
          <span id="task-content-error" className={styles.error}>
            {contentError}
          </span>
        ) : null}
      </label>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create task'}
      </button>
    </form>
  );
}
