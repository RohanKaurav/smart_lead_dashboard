export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'lost'] as const;
export const LEAD_SOURCES = ['website', 'instagram', 'referral'] as const;
export const LEAD_SORT_OPTIONS = ['latest', 'oldest'] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadSortOption = (typeof LEAD_SORT_OPTIONS)[number];

export interface LeadPublic {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
