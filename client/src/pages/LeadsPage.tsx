import { useCallback, useEffect, useState } from 'react';
import * as leadsApi from '../api/leads.api';
import { ApiRequestError } from '../api/client';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { LeadTable } from '../components/leads/LeadTable';
import { Pagination } from '../components/leads/Pagination';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useLeadFilters } from '../hooks/useLeadFilters';
import type { PaginationMeta } from '../types/api';
import type { Lead } from '../types/lead';
import type { LeadFormValues } from '../schemas/lead.schema';

export function LeadsPage() {
  const { user } = useAuth();
  const { filters, updateFilters, clearFilters } = useLeadFilters();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await leadsApi.fetchLeads(filters);
      setLeads(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Failed to load leads. Please try again.';
      setError(message);
      setLeads([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedLead(null);
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setModalMode('edit');
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleCreateOrUpdate = async (values: LeadFormValues) => {
    if (modalMode === 'create') {
      await leadsApi.createLead(values);
    } else if (selectedLead) {
      await leadsApi.updateLead(selectedLead.id, values);
    }

    await loadLeads();
  };

  const handleDelete = async (lead: Lead) => {
    const confirmed = window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await leadsApi.deleteLead(lead.id);
      await loadLeads();
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Failed to delete lead. Please try again.';
      window.alert(message);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const { page: _page, ...exportFilters } = filters;
      const blob = await leadsApi.exportLeadsCsv(exportFilters);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Failed to export leads. Please try again.';
      window.alert(message);
    } finally {
      setIsExporting(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const hasFilters = Boolean(filters.status || filters.source || filters.search);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Leads</h1>
          <p className="mt-1 text-sm text-slate-600">Manage and filter your sales pipeline</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="w-auto px-4" isLoading={isExporting} onClick={handleExport}>
            Export CSV
          </Button>
          <Button className="w-auto px-4" onClick={openCreateModal}>
            Add lead
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <LeadFiltersBar filters={filters} onChange={updateFilters} onClear={clearFilters} />

        {error ? (
          <Alert message={error} />
        ) : null}

        {isLoading ? (
          <Spinner label="Loading leads…" />
        ) : leads.length === 0 ? (
          <EmptyState
            title={hasFilters ? 'No leads match your filters' : 'No leads yet'}
            description={
              hasFilters
                ? 'Try adjusting your filters or clear them to see all leads.'
                : 'Create your first lead to get started.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" className="w-auto px-4" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button className="w-auto px-4" onClick={openCreateModal}>
                  Add lead
                </Button>
              )
            }
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
            {pagination ? (
              <Pagination
                pagination={pagination}
                onPageChange={(page) => updateFilters({ page }, { resetPage: false })}
              />
            ) : null}
          </>
        )}
      </div>

      <LeadFormModal
        isOpen={modalOpen}
        mode={modalMode}
        lead={selectedLead}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />
    </DashboardLayout>
  );
}
