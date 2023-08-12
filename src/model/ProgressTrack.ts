import { Schema, Model, model, Types } from 'mongoose';

enum Status {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

interface Track {
  newWeight: number;
  newHeight: number;
  newFitnessLevel: string;
  isAchieveGoal: boolean;
}

interface Progress {
  workoutSession: string;
  track: Track;
  performance: string;
  status: Status;
  builder: Types.ObjectId;
  workout: Types.ObjectId;
}

const progressTrackSchema = new Schema<Progress>(
  {
    workoutSession: { type: String, required: [true, 'Workout session must be required*'] },
    track: { type: Object, required: [true, 'User fitness tracking system must be required*'] },
    performance: {
      type: String,
      required: [true, 'User performance track must be required*']
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PUBLIC,
      required: [true, 'User status must be required*'],
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
  { timestamps: true, id: true },
);

const ProgressTrack: Model<Progress> = model<Progress>('ProgerssTrack', progressTrackSchema);

export default ProgressTrack;
