
import * as React from "react";
import type { Table as TanTable } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

type Props<TData> = {
  table: TanTable<TData>;
};

export function TablePagination<TData>({ table }: Props<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = Math.max(1, table.getPageCount());
  const totalRows = table.getPrePaginationRowModel().rows.length;

  const getPages = React.useCallback((): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const current = pageIndex + 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const left = Math.max(2, current - 1);
    const right = Math.min(totalPages - 1, current + 1);

    if (left > 2) pages.push("ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("ellipsis");

    pages.push(totalPages);
    return pages;
  }, [pageIndex, totalPages]);

  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="flex items-center justify-between w-full py-4">

      <div className="text-sm text-gray-600">
        Affichage <span className="font-semibold">{from}</span>–
        <span className="font-semibold">{to}</span> sur{" "}
        <span className="font-semibold">{totalRows}</span>
      </div>

      <Pagination>
        <PaginationContent className="gap-2">

          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer border border-[#D0D7DE] rounded-md px-3 py-1 text-[#0070AD] hover:bg-[#E6F2FA]"
              aria-disabled={!table.getCanPreviousPage()}
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
            />
          </PaginationItem>

          {getPages().map((p, idx) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis className="text-[#0070AD]" />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  className={`cursor-pointer border border-[#D0D7DE] rounded-md px-3 py-1
                    ${
                      p === pageIndex + 1
                        ? "bg-[#0070AD] text-white font-semibold border-[#0070AD]"
                        : "text-[#0070AD] hover:bg-[#E6F2FA]"
                    }`}
                  isActive={p === pageIndex + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(p - 1);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer border border-[#D0D7DE] rounded-md px-3 py-1 text-[#0070AD] hover:bg-[#E6F2FA]"
              aria-disabled={!table.getCanNextPage()}
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2">
        <label htmlFor="rows-per-page" className="text-sm text-gray-600">Lignes</label>
        <select
          className="border border-[#D0D7DE] rounded-md px-2 py-1"
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
