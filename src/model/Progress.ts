import { Schema, Model, model } from 'mongoose';
import { IProgress } from '../types/interfaces';
import { Status } from '../types/enums';



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

const Progress: Model<IProgress> = model<IProgress>('Progress', progressSchema);

export default Progress;
