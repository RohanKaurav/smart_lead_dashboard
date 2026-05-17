import { z } from 'zod';
import { LEAD_SORT_OPTIONS, LEAD_SOURCES, LEAD_STATUSES } from '../types/lead';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid lead id');

export const createLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z.email('Invalid email address'),
    status: z.enum(LEAD_STATUSES).default('new'),
    source: z.enum(LEAD_SOURCES),
  })
  .strict();

export const updateLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    email: z.email('Invalid email address').optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    source: z.enum(LEAD_SOURCES).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });

export const leadFilterQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().min(1).optional(),
  sort: z.enum(LEAD_SORT_OPTIONS).default('latest'),
});

export const leadListQuerySchema = leadFilterQuerySchema.extend({
  page: z.coerce.number().int().min(1).default(1),
});

export const leadExportQuerySchema = leadFilterQuerySchema;

export const leadIdParamSchema = z.object({
  id: objectIdSchema,
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadFilterQuery = z.infer<typeof leadFilterQuerySchema>;
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type LeadExportQuery = z.infer<typeof leadExportQuerySchema>;
