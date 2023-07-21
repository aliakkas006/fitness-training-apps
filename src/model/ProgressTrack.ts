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

const ProgressTrackSchema = new Schema<Progress>(
  {
    workoutSession: { type: String, required: true },
    track: { type: Object, required: true },
    performance: String,
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
  { timestamps: true, id: true },
);

const ProgressTrack: Model<Progress> = model<Progress>('ProgerssTrack', ProgressTrackSchema);

export default ProgressTrack;
