import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as leadsApi from '../api/leads.api';
import { ApiRequestError } from '../api/client';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { StatusBadge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import type { Lead } from '../types/lead';
import type { LeadFormValues } from '../schemas/lead.schema';
import { formatDateTime, labelCase } from '../utils/format';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const loadLead = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await leadsApi.fetchLeadById(id);
      setLead(data);
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Failed to load lead. Please try again.';
      setError(message);
      setLead(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadLead();
  }, [loadLead]);

  const handleUpdate = async (values: LeadFormValues) => {
    if (!id) return;
    const updated = await leadsApi.updateLead(id, values);
    setLead(updated);
  };

  const handleDelete = async () => {
    if (!lead) return;

    const confirmed = window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await leadsApi.deleteLead(lead.id);
      void navigate('/leads');
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Failed to delete lead. Please try again.';
      window.alert(message);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link to="/leads" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          ← Back to leads
        </Link>
      </div>

      {isLoading ? (
        <Spinner label="Loading lead…" />
      ) : error ? (
        <Alert message={error} />
      ) : lead ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{lead.name}</h1>
              <p className="mt-2 text-slate-600">{lead.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" className="w-auto px-4" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              {isAdmin ? (
                <Button variant="danger" className="w-auto px-4" onClick={handleDelete}>
                  Delete
                </Button>
              ) : null}
            </div>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-2">
                <StatusBadge status={lead.status} />
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Source</dt>
              <dd className="mt-2 text-sm font-medium text-slate-900">{labelCase(lead.source)}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Created</dt>
              <dd className="mt-2 text-sm font-medium text-slate-900">
                {formatDateTime(lead.createdAt)}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated</dt>
              <dd className="mt-2 text-sm font-medium text-slate-900">
                {formatDateTime(lead.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      {lead ? (
        <LeadFormModal
          isOpen={editOpen}
          mode="edit"
          lead={lead}
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdate}
        />
      ) : null}
    </DashboardLayout>
  );
}
