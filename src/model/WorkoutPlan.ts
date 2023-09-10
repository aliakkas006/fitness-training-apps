import { Schema, Model, model, Types } from 'mongoose';

export enum Status {
  PROGRESS = 'progress',
  DONE = 'done',
}

export interface Workout {
  name: string;
  mode: string;
  equipment: Types.Array<string>;
  exercises: Types.Array<string>;
  trainerTips: Types.Array<string>;
  status?: Status;
  photo?: string;
  builder: Types.ObjectId;
}

const workoutPlanSchema = new Schema<Workout>(
  {
    name: { type: String, required: [true, 'Workout name must be required*'] },
    mode: { type: String, required: [true, 'Workout mode must be required*'] },
    equipment: { type: [String], required: [true, 'Workout equipments must be required*'] },
    exercises: { type: [String], required: [true, 'Exercises name must be required*'] },
    trainerTips: { type: [String], required: [true, 'Trainer tips must be required*'] },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PROGRESS,
    },
    photo: {
      type: String,
      validate: {
        validator: (path: string) => /\.(jpg|jpeg|png)$/i.test(path),
        message: 'Only JPG, JPEG and PNG images are allowed!',
      },
    },
    builder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
  { timestamps: true, id: true }
);

const WorkoutPlan: Model<Workout> = model<Workout>('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
