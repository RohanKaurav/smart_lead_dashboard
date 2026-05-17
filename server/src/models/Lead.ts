import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from '../types/lead';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ILeadDocument = HydratedDocument<ILead>;

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'new',
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ name: 1 });
leadSchema.index({ email: 1 });

export const Lead: Model<ILead> = model<ILead>('Lead', leadSchema);
