import { Document, Types } from 'mongoose';
import { FitnessLevel, Goal, Role, Status, UStatus, WStatus } from './enums';

export interface User extends IUser {
  id: string;
}

export interface Config {
  totalItems: number;
  limit: number;
  page: number;
  sortType: string;
  sortBy: string;
  search: string;
  algorithm: string;
  expiresIn: string;
}

export interface LoginParam {
  email: string;
  password: string;
  issuedIp: string;
}

export interface RegisterParam {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateProps {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  age: number;
  height: number;
  weight: number;
  fitnessLevel: FitnessLevel;
  goal: Goal;
}

export interface CheckOwnershipParam {
  resourceId: string;
  userId: string;
}

export interface ProgressUpdateProps {
  workoutSession: string;
  trackProgress: Track;
  performance: string;
  status: Status;
}

export interface RefreshTokenParam {
  userId: string;
  issuedIp: string;
  name: string;
  email: string;
  role: Role;
}

export interface RotateRefreshTokenParam {
  token: string;
  clientIp: string;
}

export interface LogoutParam extends RotateRefreshTokenParam {
  user: any;
}

export interface CreateAccountParam {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateProps {
  name: string;
  email: string;
  role: Role;
  status: UStatus;
}

export interface WorkoutUpdateProps {
  name: string;
  mode: string;
  equipment: Array<string>;
  exercises: Array<string>;
  trainerTips: Array<string>;
  photo?: string;
  status?: WStatus;
}

export interface WorkoutCreateProps extends WorkoutUpdateProps {
  //
  builder: { id: string };
}

// Profile model interface
export interface IProfile extends ProfileUpdateProps {
  user: Types.ObjectId;
}

// Progress model interfaces
export interface Track {
  newWeight: string;
  newHeight: string;
  newFitnessLevel: FitnessLevel;
  achievedGoal: Goal;
}

export interface IProgress extends ProgressUpdateProps {
  builder: Types.ObjectId;
  workout: Types.ObjectId;
}

// Refresh Token model interfaces
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

// User model interface
export interface IUser extends UserUpdateProps {
  password: string;
}

// Workout model interface
export interface Workout extends WorkoutUpdateProps {
  builder: Types.ObjectId;
  progresses: Array<Types.ObjectId>;
}

// Query utils interfaces
export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPage: number;
  next?: number;
  prev?: number;
}

export interface Links {
  self: string;
  next?: string;
  prev?: string;
}

export interface PaginationParam {
  totalItems?: number;
  limit?: number;
  page?: number;
}

export interface HATEOASLinksParam {
  url?: string;
  path?: string;
  query?: object;
  page?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface TransformedItemsParam {
  items: Array<any>;
  selection?: Array<string>;
  path?: string;
}

