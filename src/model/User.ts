import { Schema, Model, model } from 'mongoose';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
  DECLINED = 'declined',
}

interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: Status;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
  },
  { timestamps: true, id: true },
);

const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;
