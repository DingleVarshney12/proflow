"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const PaginationComp = ({
  paginationDetails,
  setPage,
  page,
}: {
  paginationDetails: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
  } | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}) => {
  return (
    <>
      {(paginationDetails?.totalPages as number) > 1 ? (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  paginationDetails && page < paginationDetails.totalPages
                    ? setPage((p) => p + 1)
                    : null
                }
                aria-disabled={
                  !paginationDetails || page === paginationDetails.totalPages
                }
                          />
                          
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <></>
          )}
    </>
  );
};

export default PaginationComp;
