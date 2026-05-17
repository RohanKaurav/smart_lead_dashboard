import mongoose, { type SortOrder } from 'mongoose';
import { Lead } from '../models/Lead';
import type {
  CreateLeadInput,
  LeadFilterQuery,
  LeadListQuery,
  UpdateLeadInput,
} from '../schemas/lead.schema';
import type { LeadPublic, LeadSource, LeadStatus } from '../types/lead';
import type { AuthUser } from '../types/user';
import {
  assertCanAccessLead,
  assertCanDeleteLead,
  getLeadOwnerFilter,
} from '../utils/authorization';
import { AppError } from '../utils/AppError';
import { toLeadPublic } from '../utils/leadMapper';
import {
  buildPaginationMeta,
  getPagination,
  LEADS_PAGE_LIMIT,
} from '../utils/pagination';

type LeadFilter = {
  createdBy?: mongoose.Types.ObjectId;
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{ name: { $regex: string; $options: string } } | { email: { $regex: string; $options: string } }>;
};

export function buildLeadFilter(user: AuthUser, query: LeadFilterQuery): LeadFilter {
  const filter: LeadFilter = {
    ...getLeadOwnerFilter(user),
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const searchRegex = { $regex: query.search, $options: 'i' };
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
}

export function buildLeadSort(sort: LeadFilterQuery['sort']): Record<string, SortOrder> {
  return {
    createdAt: sort === 'oldest' ? 1 : -1,
  };
}

export async function listLeads(
  user: AuthUser,
  query: LeadListQuery,
): Promise<{ leads: LeadPublic[]; pagination: ReturnType<typeof buildPaginationMeta> }> {
  const filter = buildLeadFilter(user, query);
  const sort = buildLeadSort(query.sort);
  const { page, limit, skip } = getPagination(query.page, LEADS_PAGE_LIMIT);

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  return {
    leads: leads.map((lead) => toLeadPublic(lead)),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

export async function getLeadById(user: AuthUser, leadId: string): Promise<LeadPublic> {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError(400, 'Invalid lead id');
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError(404, 'Lead not found');
  }

  assertCanAccessLead(user, lead.createdBy.toString());

  return toLeadPublic(lead);
}

export async function createLead(user: AuthUser, input: CreateLeadInput): Promise<LeadPublic> {
  const lead = await Lead.create({
    name: input.name,
    email: input.email,
    status: input.status,
    source: input.source,
    createdBy: user.id,
  });

  return toLeadPublic(lead);
}

export async function updateLead(
  user: AuthUser,
  leadId: string,
  input: UpdateLeadInput,
): Promise<LeadPublic> {
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError(400, 'Invalid lead id');
  }

  const lead = await Lead.findById(leadId);

  if (!lead) {
    throw new AppError(404, 'Lead not found');
  }

  assertCanAccessLead(user, lead.createdBy.toString());

  if (input.name !== undefined) lead.name = input.name;
  if (input.email !== undefined) lead.email = input.email;
  if (input.status !== undefined) lead.status = input.status;
  if (input.source !== undefined) lead.source = input.source;

  await lead.save();

  return toLeadPublic(lead);
}

export async function deleteLead(user: AuthUser, leadId: string): Promise<void> {
  assertCanDeleteLead(user);

  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new AppError(400, 'Invalid lead id');
  }

  const lead = await Lead.findByIdAndDelete(leadId);

  if (!lead) {
    throw new AppError(404, 'Lead not found');
  }
}
