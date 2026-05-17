import mongoose from 'mongoose';
import type { AuthUser } from '../types/user';
import { AppError } from './AppError';

/** Admins see all leads; sales users only see leads they created. */
export function getLeadOwnerFilter(user: AuthUser): { createdBy?: mongoose.Types.ObjectId } {
  if (user.role === 'admin') {
    return {};
  }

  return { createdBy: new mongoose.Types.ObjectId(user.id) };
}

export function assertCanAccessLead(user: AuthUser, leadCreatedBy: string): void {
  if (user.role === 'admin') {
    return;
  }

  if (leadCreatedBy !== user.id) {
    throw new AppError(403, 'You do not have permission to access this lead');
  }
}

export function assertCanDeleteLead(user: AuthUser): void {
  if (user.role !== 'admin') {
    throw new AppError(403, 'Only administrators can delete leads');
  }
}
