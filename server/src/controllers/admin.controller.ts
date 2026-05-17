import type { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import type { ApiSuccessResponse } from '../types/api';
import { asyncHandler } from '../utils/asyncHandler';

export const getOverview = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getAdminOverview();

  const response: ApiSuccessResponse<adminService.AdminOverview> = {
    success: true,
    data,
  };

  res.status(200).json(response);
});
