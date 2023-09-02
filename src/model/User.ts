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

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
  status?: Status;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      maxlength: 30,
      minlength: 5,
      required: [true, 'User name must be required*'],
    },
    email: {
      type: String,
      validate: {
        validator: (email: string) => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email! `,
      },
      required: [true, 'Email must be required*'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'User password must be required*'],
    },
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
  { timestamps: true, id: true }
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
