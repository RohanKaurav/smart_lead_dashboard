import type { Request, Response } from 'express';
import type {
  CreateLeadInput,
  LeadExportQuery,
  LeadListQuery,
  UpdateLeadInput,
} from '../schemas/lead.schema';
import type { z } from 'zod';
import { leadIdParamSchema } from '../schemas/lead.schema';
import * as exportService from '../services/export.service';
import * as leadService from '../services/lead.service';
import type { ApiSuccessResponse, PaginatedApiResponse } from '../types/api';
import type { LeadPublic } from '../types/lead';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

type LeadIdParams = z.infer<typeof leadIdParamSchema>;

function requireAuthUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  return req.user;
}

export const exportLeads = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const query = req.query as unknown as LeadExportQuery;
  const csv = await exportService.exportLeadsCsv(user, query);

  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
});

export const listLeads = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const query = req.query as unknown as LeadListQuery;
  const { leads, pagination } = await leadService.listLeads(user, query);

  const response: PaginatedApiResponse<LeadPublic[]> = {
    success: true,
    data: leads,
    pagination,
  };

  res.status(200).json(response);
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const { id } = req.params as LeadIdParams;
  const data = await leadService.getLeadById(user, id);

  const response: ApiSuccessResponse<LeadPublic> = {
    success: true,
    data,
  };

  res.status(200).json(response);
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const body = req.body as CreateLeadInput;
  const data = await leadService.createLead(user, body);

  const response: ApiSuccessResponse<LeadPublic> = {
    success: true,
    data,
    message: 'Lead created successfully',
  };

  res.status(201).json(response);
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const { id } = req.params as LeadIdParams;
  const body = req.body as UpdateLeadInput;
  const data = await leadService.updateLead(user, id, body);

  const response: ApiSuccessResponse<LeadPublic> = {
    success: true,
    data,
    message: 'Lead updated successfully',
  };

  res.status(200).json(response);
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const user = requireAuthUser(req);
  const { id } = req.params as LeadIdParams;
  await leadService.deleteLead(user, id);

  const response: ApiSuccessResponse<null> = {
    success: true,
    data: null,
    message: 'Lead deleted successfully',
  };

  res.status(200).json(response);
});
