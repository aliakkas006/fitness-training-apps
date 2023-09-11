import { Schema, Model, model, Types } from 'mongoose';
import { FitnessLevel, Goal } from './Profile';

export enum Status {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export interface Track {
  newWeight: string;
  newHeight: string;
  newFitnessLevel: FitnessLevel;
  achievedGoal: Goal;
}

export interface IProgress {
  workoutSession: string;
  trackProgress: Track;
  performance: string;
  status: Status;
  builder: Types.ObjectId;
  workout: Types.ObjectId;
}

const progressSchema = new Schema<IProgress>(
  {
    workoutSession: { type: String, required: [true, 'Workout session must be required*'] },
    trackProgress: {
      type: Object,
      required: [true, 'User fitness progress tracking data must be required*'],
    },
    performance: {
      type: String,
      required: [true, 'User performance must be required*'],
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PUBLIC,
    },
    builder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    workout: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
    },
  },
  { timestamps: true, id: true }
);

const Progress: Model<IProgress> = model<IProgress>('Progerss', progressSchema);

export default Progress;
