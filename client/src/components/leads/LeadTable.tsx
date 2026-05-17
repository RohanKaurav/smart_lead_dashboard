import { Link } from 'react-router-dom';
import type { Lead } from '../../types/lead';
import { formatDateTime, labelCase } from '../../utils/format';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface LeadTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadTable({ leads, isAdmin, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 font-medium text-slate-900">
                <Link to={`/leads/${lead.id}`} className="hover:text-indigo-600">
                  {lead.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{labelCase(lead.source)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDateTime(lead.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="w-auto px-3 py-1.5 text-xs"
                    onClick={() => onEdit(lead)}
                  >
                    Edit
                  </Button>
                  {isAdmin ? (
                    <Button
                      variant="danger"
                      className="w-auto px-3 py-1.5 text-xs"
                      onClick={() => onDelete(lead)}
                    >
                      Delete
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
