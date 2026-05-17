import { Schema, model, type HydratedDocument, type Model } from 'mongoose';
import { USER_ROLES, type UserRole } from '../types/user';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
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
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'sales',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const sanitized = { ...ret } as Record<string, unknown>;
    delete sanitized.password;
    delete sanitized.__v;
    return sanitized;
  },
});

export const User: Model<IUser> = model<IUser>('User', userSchema);
