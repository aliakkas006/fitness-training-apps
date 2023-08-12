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

const profileSchema = new Schema<IProfile>({
  firstName: { type: String, required: [true, 'User first name must be required*'] },
  lastName: { type: String, required: [true, 'User user last name must be required*'] },
  profilePic: {
    type: String,
    validate: {
      validator: (path: string) => /\.(jpg|jpeg|png)$/i.test(path),
      message: 'Only JPG, JPEG and PNG images are allowed!',
    },
    unique: true,
  },
  age: {
    type: Number,
    required: [true, 'Age must be required*'],
    min: [18, 'age must not be under 18 years old'],
    max: [60, 'age must be under 60 years old'],
  },
  weight: { type: Number, required: [true, 'Weight must be required*'] },
  height: { type: Number, required: [true, 'Height must be required*'] },
  fitnessLevel: {
    type: String,
    required: [true, 'Fitness level must be required*'],
    enum: Object.values(FitnessLevel), // Restrict possible values to FitnessLevel enum
    default: FitnessLevel.BEGINNER,
  },
  goal: {
    type: String,
    required: [true, 'User goal must be required*'],
    enum: Object.values(Goal), // Restrict possible values to Goal enum
    default: Goal.MAINTAIN_FITNESS,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Profile: Model<IProfile> = model<IProfile>('Profile', profileSchema);

export default Profile;
