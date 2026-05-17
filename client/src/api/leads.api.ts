import type { PaginatedApiResponse } from '../types/api';
import type { Lead, LeadFilters } from '../types/lead';
import { apiRequest, ApiRequestError } from './client';
import { getToken } from '../utils/token';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://smart-lead-dashboard-1-tqur.onrender.com/api';

function buildQueryString(filters: Partial<LeadFilters>): string {
  const params = new URLSearchParams();

  if (filters.page) params.set('page', String(filters.page));
  if (filters.status) params.set('status', filters.status);
  if (filters.source) params.set('source', filters.source);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  return query ? `?${query}` : '';
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status: Lead['status'];
  source: Lead['source'];
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export async function fetchLeads(
  filters: LeadFilters,
): Promise<PaginatedApiResponse<Lead[]>> {
  const response = await apiRequest<Lead[]>(`/leads${buildQueryString(filters)}`);
  return response as PaginatedApiResponse<Lead[]>;
}

export async function fetchLeadById(id: string): Promise<Lead> {
  const response = await apiRequest<Lead>(`/leads/${id}`);
  return response.data;
}

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const response = await apiRequest<Lead>('/leads', {
    method: 'POST',
    body: payload,
  });
  return response.data;
}

export async function updateLead(id: string, payload: UpdateLeadPayload): Promise<Lead> {
  const response = await apiRequest<Lead>(`/leads/${id}`, {
    method: 'PATCH',
    body: payload,
  });
  return response.data;
}

export async function deleteLead(id: string): Promise<void> {
  await apiRequest<null>(`/leads/${id}`, { method: 'DELETE' });
}

export async function exportLeadsCsv(filters: Omit<LeadFilters, 'page'>): Promise<Blob> {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/leads/export${buildQueryString(filters)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!response.ok) {
    try {
      const payload = (await response.json()) as { message?: string };
      throw new ApiRequestError(payload.message ?? 'Export failed', response.status);
    } catch (error) {
      if (error instanceof ApiRequestError) throw error;
      throw new ApiRequestError('Export failed', response.status);
    }
  }

  return response.blob();
}
