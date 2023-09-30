import { Schema, Model, model } from 'mongoose';
import { Workout } from '../types/interfaces';
import { WStatus } from '../types/enums';

const workoutPlanSchema = new Schema<Workout>(
  {
    name: { type: String, required: [true, 'Workout name must be required*'] },
    mode: { type: String, required: [true, 'Workout mode must be required*'] },
    equipment: { type: [String], required: [true, 'Workout equipments must be required*'] },
    exercises: { type: [String], required: [true, 'Exercises name must be required*'] },
    trainerTips: { type: [String], required: [true, 'Trainer tips must be required*'] },
    status: {
      type: String,
      enum: Object.values(WStatus),
      default: WStatus.PROGRESS,
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
      required: true,
    },
    progresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Progress'
      }
    ]
  },
  { timestamps: true, id: true }
);

const WorkoutPlan: Model<Workout> = model<Workout>('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
