import { stringify } from 'csv-stringify/sync';
import { Lead } from '../models/Lead';
import type { LeadExportQuery } from '../schemas/lead.schema';
import type { AuthUser } from '../types/user';
import { buildLeadFilter, buildLeadSort } from './lead.service';

const CSV_HEADERS = ['name', 'email', 'status', 'source', 'createdAt'] as const;

export async function exportLeadsCsv(user: AuthUser, query: LeadExportQuery): Promise<string> {
  const filter = buildLeadFilter(user, query);
  const sort = buildLeadSort(query.sort);

  const leads = await Lead.find(filter).sort(sort).lean();

  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.createdAt.toISOString(),
  ]);

  return stringify([CSV_HEADERS, ...rows]);
}
