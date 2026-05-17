import { useEffect, useState } from 'react';
import { LEAD_SORT_OPTIONS, LEAD_SOURCES, LEAD_STATUSES } from '../../types/lead';
import { useDebounce } from '../../hooks/useDebounce';
import type { LeadFilters } from '../../types/lead';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (partial: Partial<LeadFilters>) => void;
  onClear: () => void;
}

export function LeadFiltersBar({ filters, onChange, onClear }: LeadFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  useEffect(() => {
    const normalized = debouncedSearch.trim();
    const current = filters.search ?? '';

    if (normalized !== current) {
      onChange({ search: normalized || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, onChange]);

  const hasActiveFilters = Boolean(filters.status || filters.source || filters.search);

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
      <Input
        label="Search"
        placeholder="Name or email"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />

      <Select
        label="Status"
        value={filters.status ?? ''}
        onChange={(event) =>
          onChange({
            status: (event.target.value || undefined) as LeadFilters['status'],
            page: 1,
          })
        }
        options={[
          { value: '', label: 'All statuses' },
          ...LEAD_STATUSES.map((status) => ({ value: status, label: status })),
        ]}
      />

      <Select
        label="Source"
        value={filters.source ?? ''}
        onChange={(event) =>
          onChange({
            source: (event.target.value || undefined) as LeadFilters['source'],
            page: 1,
          })
        }
        options={[
          { value: '', label: 'All sources' },
          ...LEAD_SOURCES.map((source) => ({ value: source, label: source })),
        ]}
      />

      <Select
        label="Sort"
        value={filters.sort}
        onChange={(event) =>
          onChange({
            sort: event.target.value as LeadFilters['sort'],
            page: 1,
          })
        }
        options={LEAD_SORT_OPTIONS.map((sort) => ({
          value: sort,
          label: sort === 'latest' ? 'Latest first' : 'Oldest first',
        }))}
      />

      <div className="flex items-end">
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
