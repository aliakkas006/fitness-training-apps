import { Schema, model, Model, Types, Document } from 'mongoose';
import { isAfter } from 'date-fns';

export interface IRefreshToken {
  user: Types.ObjectId;
  issuedIp: string;
  token: string;
  replaceByToken?: string;
  expiredAt: Date;
  revokedAt?: Date;
  revokedIp?: string;
}

export interface RefreshTokenDocument extends Document, IRefreshToken {
  isExpired: boolean;
  isActive: boolean;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issuedIp: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    replaceByToken: String,
    expiredAt: {
      type: Date,
      required: true,
    },
    revokedAt: Date,
    revokedIp: String,
  },
  { timestamps: true, id: true }
);

refreshTokenSchema.virtual('isExpired').get(function (this: RefreshTokenDocument) {
  return isAfter(new Date(), this.expiredAt);
});

refreshTokenSchema.virtual('isActive').get(function (this: RefreshTokenDocument) {
  return !this.revokedAt && !this.isExpired;
});

refreshTokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

const RefreshToken: Model<RefreshTokenDocument> = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);

export default RefreshToken;
