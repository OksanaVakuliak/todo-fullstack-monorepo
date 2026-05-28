import styles from './TaskPagination.module.css';

type TaskPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getVisiblePages = (page: number, totalPages: number) => {
  const pages: number[] = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    pages.push(currentPage);
  }

  return pages;
};

export default function TaskPagination({
  page,
  totalPages,
  onPageChange,
}: TaskPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Task pages">
      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      <div className={styles.pages}>
        {visiblePages.map((currentPage) => (
          <button
            key={currentPage}
            type="button"
            className={`${styles.pageButton} ${
              currentPage === page ? styles.active : ''
            }`}
            onClick={() => onPageChange(currentPage)}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {currentPage}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
