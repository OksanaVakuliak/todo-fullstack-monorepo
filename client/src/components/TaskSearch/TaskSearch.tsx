import { useEffect, useState } from 'react';
import styles from './TaskSearch.module.css';

type TaskSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TaskSearch({ value, onChange }: TaskSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (inputValue === value) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onChange(inputValue);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [inputValue, onChange, value]);

  return (
    <label className={styles.search}>
      <span className={styles.label}>Search tasks</span>
      <input
        className={styles.input}
        type="search"
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
        placeholder="Search by title or content"
      />
    </label>
  );
}
