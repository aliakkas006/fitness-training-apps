import { Schema, Model, model, Types } from 'mongoose';

enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

enum Goal {
  LOSE_WEIGHT = 'lose_weight',
  BUILD_MUSCLE = 'build_muscle',
  MAINTAIN_FITNESS = 'maintain_fitness',
}

interface IProfile {
  firstName: string;
  lastName: string;
  profilePic?: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel: FitnessLevel;
  goal: Goal;
  user: Types.ObjectId;
}

const ProfileSchema = new Schema<IProfile>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePic: String,
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  fitnessLevel: {
    type: String,
    required: true,
    enum: Object.values(FitnessLevel), // Restrict possible values to FitnessLevel enum
    default: FitnessLevel.BEGINNER,
  },
  goal: {
    type: String,
    required: true,
    enum: Object.values(Goal), // Restrict possible values to Goal enum
    default: Goal.MAINTAIN_FITNESS
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Profile: Model<IProfile> = model<IProfile>('Profile', ProfileSchema);

export default Profile;
