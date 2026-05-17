import type { ILeadDocument } from '../models/Lead';
import type { LeadPublic } from '../types/lead';

export function toLeadPublic(lead: ILeadDocument): LeadPublic {
  return {
    id: lead._id.toString(),
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdBy: lead.createdBy.toString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}
