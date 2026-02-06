import React from "react";

type PageItem = number | "ellipsis";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  items.push(1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-9 px-4 rounded-full text-sm font-bold border transition-colors ${
          currentPage === 1
            ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-primary/30 hover:text-neutral-900"
        }`}
      >
        Prev
      </button>

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={`page-${item}`}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`min-w-[36px] h-9 px-3 rounded-full text-sm font-bold border transition-colors ${
              item === currentPage
                ? "bg-primary text-white border-primary"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-primary/30 hover:text-neutral-900"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-9 px-4 rounded-full text-sm font-bold border transition-colors ${
          currentPage === totalPages
            ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-primary/30 hover:text-neutral-900"
        }`}
      >
        Next
      </button>
    </nav>
  );
}
