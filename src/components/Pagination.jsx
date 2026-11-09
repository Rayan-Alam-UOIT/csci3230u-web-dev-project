import { useEffect, useState } from "react";
import { EDGE_COUNT, SIBLING_COUNT } from "../constants/pagination";

function range(start, end) {
  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );
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
  const [pageInput, setPageInput] = useState(String(page));
  const [error, setError] = useState("");

  useEffect(() => {
    setPageInput(String(page));
    setError("");
  }, [page]);

  if (totalPages <= 1) return null;

  const go = (target) => {
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  const handleJump = (e) => {
    e.preventDefault();

    const target = Number(pageInput);

    if (
      !pageInput.trim() ||
      !Number.isInteger(target) ||
      target < 1 ||
      target > totalPages
    ) {
      setError(`Enter a page between 1 and ${totalPages}.`);
      return;
    }

    setError("");
    go(target);
  };

  const items = getPageItems(page, totalPages);

  return (
    <nav className="pagination" aria-label="Pagination">
      <div className="pagination-pages">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => go(page - 1)}
        >
          ‹
        </button>

        {items.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              className="pagination-ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={item}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => go(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => go(page + 1)}
        >
          ›
        </button>
      </div>

      <div className="pagination-bottom">
        <span className="pagination-info" role="status">
          Page {page} of {totalPages}
        </span>

        <form className="pagination-jump" onSubmit={handleJump}>
          <label htmlFor="pagination-page-input">
            Go to
          </label>

          <input
            id="pagination-page-input"
            type="number"
            min="1"
            max={totalPages}
            step="1"
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value);
              setError("");
            }}
            aria-label="Page number"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "pagination-error" : undefined}
          />

          <button type="submit" className="pagination-go">
            Go
          </button>
        </form>
      </div>

      {error && (
        <span id="pagination-error" className="pagination-error" role="alert">
          {error}
        </span>
      )}
    </nav>
  );
}

export default Pagination;
