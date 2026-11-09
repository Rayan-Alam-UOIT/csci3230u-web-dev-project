import { EDGE_COUNT, SIBLING_COUNT } from "../constants/pagination";

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageItems(page, totalPages) {
  const maxVisible = EDGE_COUNT * 2 + SIBLING_COUNT * 2 + 3;
  if (totalPages <= maxVisible) return range(1, totalPages);

  const leftSibling = Math.max(page - SIBLING_COUNT, EDGE_COUNT + 1);
  const rightSibling = Math.min(page + SIBLING_COUNT, totalPages - EDGE_COUNT);

  const showLeftEllipsis = leftSibling > EDGE_COUNT + 2;
  const showRightEllipsis = rightSibling < totalPages - EDGE_COUNT - 1;

  const items = [...range(1, EDGE_COUNT)];

  if (showLeftEllipsis) items.push("ellipsis-left");
  else items.push(...range(EDGE_COUNT + 1, leftSibling - 1));

  items.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) items.push("ellipsis-right");
  else items.push(...range(rightSibling + 1, totalPages - EDGE_COUNT));

  items.push(...range(totalPages - EDGE_COUNT + 1, totalPages));

  return items;
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const go = (e, target) => {
    e.preventDefault();
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  const items = getPageItems(page, totalPages);

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

      {items.map((item) =>
        typeof item === "string" ? (
          <span key={item} className="pagination-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <a
            key={item}
            href="#"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={(e) => go(e, item)}
          >
            {item}
          </a>
        )
      )}

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