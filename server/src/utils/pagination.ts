import type { PaginationMeta } from '../types/api';

export const LEADS_PAGE_LIMIT = 10;

export function getPagination(page: number, limit: number = LEADS_PAGE_LIMIT) {
  const safePage = Math.max(1, page);
  const skip = (safePage - 1) * limit;

  return {
    page: safePage,
    limit,
    skip,
  };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}
