import WorkoutPlan from '../../model/WorkoutPlan';
import defaults from '../../config/defaults';
import CustomError from '../../utils/CustomErr';

// Define data types
enum Status {
  PROGRESS = 'progress',
  DONE = 'done',
}

type Search = {
  search: string;
};

interface FindAllParam {
  page?: number;
  limit?: number;
  sortType?: string;
  sortBy?: string;
  search?: string;
}

interface CreateParam {
  name: string;
  mode: string;
  equipment: Array<string>;
  exercises: Array<string>;
  trainerTips: Array<string>;
  photo?: string;
  status?: Status;
  builder: { id: string; name: string };
}

// find all workout plan service
const findAll = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  search = defaults.search,
}: FindAllParam) => {
  const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
  const filter = {
    name: { $regex: search, $options: 'i' },
  };

  const workouts: any = await WorkoutPlan.find(filter)
    .populate({ path: 'builder', select: 'name' })
    .sort(sortStr)
    .skip(page * limit - limit)
    .limit(limit);

  return workouts.map((workout: any) => ({
    ...workout._doc,
    id: workout.id,
  }));
};

// total workout plan count service
const count = ({ search = defaults.search }: Search) => {
  const filter = {
    name: { $regex: search, $options: 'i' },
  };
  return WorkoutPlan.count(filter);
};

// create a workout plan service
const create = ({
  name,
  mode = '',
  equipment = [],
  exercises = [],
  trainerTips = [],
  photo = '',
  status = Status.PROGRESS,
  builder,
}: CreateParam) => {
  if (!name || !builder) throw new CustomError('Invalid Arguments!', 400);

  const workoutPlan = new WorkoutPlan({
    name,
    mode,
    equipment,
    exercises,
    trainerTips,
    photo,
    status,
    builder: builder.id,
  });

  return workoutPlan.save();
};

export default {
  findAll,
  create,
  count,
};
