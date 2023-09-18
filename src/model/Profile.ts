import { Schema, Model, model } from 'mongoose';
import { IProfile } from '../types/interfaces';
import { FitnessLevel, Goal } from '../types/enums';

const profileSchema = new Schema<IProfile>(
  {
    firstName: { type: String, required: [true, 'User first name must be required*'] },
    lastName: { type: String, required: [true, 'User user last name must be required*'] },
    email: {
      type: String,
      validate: {
        validator: (email: string) => {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email! `,
      },
      required: [true, 'Email must be required*'],
      unique: true,
    },
    profilePic: {
      type: String,
      validate: {
        validator: (path: string) => /\.(jpg|jpeg|png)$/i.test(path),
        message: 'Only JPG, JPEG and PNG images are allowed!',
      },
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
      enum: Object.values(FitnessLevel),
      default: FitnessLevel.BEGINNER,
    },
    goal: {
      type: String,
      required: [true, 'User goal must be required*'],
      enum: Object.values(Goal),
      default: Goal.MAINTAIN_FITNESS,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, id: true }
);

const Profile: Model<IProfile> = model<IProfile>('Profile', profileSchema);

export default Profile;
