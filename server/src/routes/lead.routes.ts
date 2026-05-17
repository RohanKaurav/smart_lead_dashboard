import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
  createLeadSchema,
  leadExportQuerySchema,
  leadIdParamSchema,
  leadListQuerySchema,
  updateLeadSchema,
} from '../schemas/lead.schema';

const router = Router();

router.use(authenticate);

router.get('/', validate(leadListQuerySchema, 'query'), leadController.listLeads);
router.get('/export', validate(leadExportQuerySchema, 'query'), leadController.exportLeads);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.get('/:id', validate(leadIdParamSchema, 'params'), leadController.getLeadById);
router.patch(
  '/:id',
  validate(leadIdParamSchema, 'params'),
  validate(updateLeadSchema),
  leadController.updateLead,
);
router.delete(
  '/:id',
  requireRole('admin'),
  validate(leadIdParamSchema, 'params'),
  leadController.deleteLead,
);

export default router;
