import WorkoutPlan from '../../model/WorkoutPlan';
import defaults from '../../config/defaults';
import { badRequest, notFound } from '../../utils/CustomError';

// Define data types
enum Status {
  PROGRESS = 'progress',
  DONE = 'done',
}

type Search = {
  search: string;
};

//TODO: Create interface for workoutplan and payload object

interface FindAllItemsParam {
  page?: number;
  limit?: number;
  sortType?: string;
  sortBy?: string;
  search?: string;
}
//TODO:
// interface FindSingleItemParam {
//   id: string;
//   expand?: string ;
// }

interface UpdatePropertiesParam {
  name: string;
  mode: string;
  equipment: Array<string>;
  exercises: Array<string>;
  trainerTips: Array<string>;
  photo?: string;
  status?: Status;
}

interface CreateOrUpdateParam extends UpdatePropertiesParam {
  builder: { id: string };
}

interface CheckOwnershipParam {
  resourceId: string;
  userId: string;
}

class WorkoutPlanService {
  // find all workout plan
  //TODO: define the return type
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
  }: FindAllItemsParam): Promise<any> {
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
  }

  // total workout plan count
  public async count({ search = defaults.search }: Search): Promise<number> {
    const filter = {
      name: { $regex: search, $options: 'i' },
    };
    return WorkoutPlan.count(filter);
  }

  // create a new workout plan
  public async create({
    name,
    mode = '',
    equipment = [],
    exercises = [],
    trainerTips = [],
    photo = '',
    status = Status.PROGRESS,
    builder,
  }: CreateOrUpdateParam): Promise<any> {
    if (!name || !builder) throw badRequest('Invalid Parameters!');

    const workoutPlan: any = new WorkoutPlan({
      name,
      mode,
      equipment,
      exercises,
      trainerTips,
      photo,
      status,
      builder: builder.id,
    });

    await workoutPlan.save();

    return {
      ...workoutPlan._doc,
      id: workoutPlan.id,
    };
  }

  // find a sigle workout plan
  public async findSingleItem({ id, expand = '' }: any): Promise<any> {
    if (!id) throw badRequest('Id is required');
    //TODO: check the expand value. is it exist or not?
    expand = expand.split(',').map((item: any) => item.trim());

    const workoutPlan: any = await WorkoutPlan.findById(id);

    if (!workoutPlan) throw notFound('Resource not found!');

    if (expand.includes('builder')) {
      await workoutPlan?.populate({ path: 'builder', select: 'name', strictPopulate: false });
    }

    if (expand.includes('progress')) {
      await workoutPlan?.populate({ path: 'progress' }, { strictPopulate: false });
    }

    return {
      ...workoutPlan._doc,
      id: workoutPlan.id,
    };
  }

  // update the workout plan using PUT request
  public async updateOrCreate(
    id: string,
    {
      name,
      mode,
      equipment,
      exercises,
      trainerTips,
      photo = '',
      status = Status.PROGRESS,
      builder,
    }: CreateOrUpdateParam
  ): Promise<{ workoutPlan: any; code: number }> {
    const workoutPlan: any = await WorkoutPlan.findById(id);

    if (!workoutPlan) {
      const workoutPlan = await this.create({
        name,
        mode,
        equipment,
        exercises,
        trainerTips,
        photo,
        status,
        builder,
      });

      return {
        workoutPlan,
        code: 201,
      };
    }

    const payload = {
      name,
      mode,
      equipment,
      exercises,
      trainerTips,
      photo,
      status,
      builder: builder.id,
    };

    workoutPlan.overwrite(payload);
    await workoutPlan.save();

    return {
      workoutPlan: { ...workoutPlan._doc, id: workoutPlan.id },
      code: 200,
    };
  }

  // Update the workout plan using PATCH request
  public async updateProperties(
    id: string,
    { name, mode, equipment, exercises, trainerTips, photo, status }: UpdatePropertiesParam
  ): Promise<any> {
    const workoutPlan: any = await WorkoutPlan.findById(id);
    if (!workoutPlan) throw notFound('Resource not found!');

    const payload: any = { name, mode, equipment, exercises, trainerTips, photo, status };

    Object.keys(payload).forEach((key) => {
      workoutPlan[key] = payload[key] ?? workoutPlan[key];
    });

    await workoutPlan.save();
    return { ...workoutPlan._doc, id: workoutPlan.id };
  }

  // delete the workout plan
  public async removeItem(id: string): Promise<any> {
    const workoutPlan: any = await WorkoutPlan.findById(id);
    if (!workoutPlan) throw notFound('Resource not found!');
    //TODO: Asynchronously delete all associated progress track
    return WorkoutPlan.findByIdAndDelete(id);
  }

  // check ownership of the workout plan
  public async checkOwnership({ resourceId, userId }: CheckOwnershipParam) {
    const workoutPlan = await WorkoutPlan.findById(resourceId);
    if (!workoutPlan) throw notFound();

    return workoutPlan.builder._id.toString() === userId ? true : false;
  }
}

const workoutPlanService = new WorkoutPlanService();

export default workoutPlanService;
