export class PaginationContext<T> {
    payload: T[];
    pagination: Pagination;
}

export class Pagination {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}