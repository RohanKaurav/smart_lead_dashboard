import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LEAD_SORT_OPTIONS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadFilters,
  type LeadSortOption,
  type LeadSource,
  type LeadStatus,
} from '../types/lead';

function parseStatus(value: string | null): LeadStatus | undefined {
  return LEAD_STATUSES.includes(value as LeadStatus) ? (value as LeadStatus) : undefined;
}

function parseSource(value: string | null): LeadSource | undefined {
  return LEAD_SOURCES.includes(value as LeadSource) ? (value as LeadSource) : undefined;
}

function parseSort(value: string | null): LeadSortOption {
  return LEAD_SORT_OPTIONS.includes(value as LeadSortOption)
    ? (value as LeadSortOption)
    : 'latest';
}

export function useLeadFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<LeadFilters>(() => {
    const page = Number(searchParams.get('page') || '1');

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      status: parseStatus(searchParams.get('status')),
      source: parseSource(searchParams.get('source')),
      search: searchParams.get('search') || undefined,
      sort: parseSort(searchParams.get('sort')),
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (partial: Partial<LeadFilters>, options?: { resetPage?: boolean }) => {
      const next = new URLSearchParams(searchParams);

      if (options?.resetPage !== false) {
        next.delete('page');
      }

      if ('page' in partial && partial.page !== undefined) {
        if (partial.page <= 1) next.delete('page');
        else next.set('page', String(partial.page));
      }

      if ('status' in partial) {
        if (partial.status) next.set('status', partial.status);
        else next.delete('status');
      }

      if ('source' in partial) {
        if (partial.source) next.set('source', partial.source);
        else next.delete('source');
      }

      if ('search' in partial) {
        if (partial.search) next.set('search', partial.search);
        else next.delete('search');
      }

      if ('sort' in partial && partial.sort) {
        if (partial.sort === 'latest') next.delete('sort');
        else next.set('sort', partial.sort);
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, updateFilters, clearFilters };
}
