import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../types/lead';

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.email('Invalid email address'),
  status: z.enum(LEAD_STATUSES),
  source: z.enum(LEAD_SOURCES),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
