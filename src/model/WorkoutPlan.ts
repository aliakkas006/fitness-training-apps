import { Schema, Model, model, Types } from 'mongoose';

enum Status {
  PROGRESS = 'progress',
  DONE = 'done',
}

interface Workout {
  name: string;
  mode: string;
  equipment: Types.Array<string>;
  exercises: Types.Array<string>;
  trainerTips: Types.Array<string>;
  status?: Status;
  photo?: string;
  builder: Types.ObjectId;
}

const WorkoutPlanSchema = new Schema<Workout>(
  {
    name: { type: String, required: true },
    mode: { type: String, required: true },
    equipment: { type: [String], required: true },
    exercises: { type: [String], required: true },
    trainerTips: { type: [String], required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PROGRESS,
    },
    photo: String,
    builder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, id: true },
);

const WorkoutPlan: Model<Workout> = model<Workout>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
