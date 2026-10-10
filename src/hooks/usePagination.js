import { useEffect, useState } from "react";

export function usePagination(items, pageSize = 9) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages); // clamp if the list shrinks

  const start = (currentPage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return { page: currentPage, setPage, totalPages, pageItems };
}