function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const go = (e, target) => {
    e.preventDefault();
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <a
        href="#"
        aria-label="Previous page"
        aria-disabled={page === 1}
        onClick={(e) => go(e, page - 1)}
      >
        ‹
      </a>

      {pages.map((n) => (
        <a
          key={n}
          href="#"
          aria-current={n === page ? "page" : undefined}
          onClick={(e) => go(e, n)}
        >
          {n}
        </a>
      ))}

      <a
        href="#"
        aria-label="Next page"
        aria-disabled={page === totalPages}
        onClick={(e) => go(e, page + 1)}
      >
        ›
      </a>
    </nav>
  );
}

export default Pagination;