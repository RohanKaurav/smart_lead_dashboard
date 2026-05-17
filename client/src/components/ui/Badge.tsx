import type { LeadStatus } from '../../types/lead';
import { labelCase } from '../../utils/format';

const statusStyles: Record<LeadStatus, string> = {
  new: 'bg-sky-100 text-sky-800',
  contacted: 'bg-amber-100 text-amber-800',
  qualified: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-rose-100 text-rose-800',
};

interface StatusBadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {labelCase(status)}
    </span>
  );
}
