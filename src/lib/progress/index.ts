import defaults from '../../config/defaults';
import Progress, { IProgress, Status, Track } from '../../model/Progress';
import WorkoutPlan from '../../model/WorkoutPlan';
import { badRequest, notFound } from '../../utils/CustomError';

// interface CreateParam {
//   workoutSession: string;
//   trackProgress: Track;
//   performance: string;
//   workoutId: number;
//   status: Status.PUBLIC;
//   builder: { id: string };
// }

interface UpdatePropertiesParam {
  workoutSession: string;
  trackProgress: Track;
  performance: string;
  status: Status;
}

interface CheckOwnershipParam {
  resourceId: string;
  userId: string;
}

class ProgressService {
  // Find all progress data
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
  }) {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;

    const progresses: any = await Progress.find({})
      .populate([
        { path: 'builder', select: 'name' },
        { path: 'workout', select: 'name' },
      ])
      .sort(sortStr)
      .skip((page - 1) * limit)
      .limit(limit);

    return progresses.map((progress: any) => ({
      ...progress._doc,
      id: progress.id,
    }));
  }

  // total progress count
  public async count(): Promise<number> {
    return Progress.count({});
  }

  // create a new workout plan
  public async create({
    workoutSession,
    trackProgress,
    performance,
    workoutId,
    status = Status.PUBLIC,
    builder,
  }: any) {
    if (!workoutSession || !trackProgress || !performance || !workoutId || !builder)
      throw badRequest('Invalid Parameters!');

    const workoutPlan = await WorkoutPlan.findById(workoutId);
    if (!workoutPlan) throw notFound();

    const progress: any = new Progress({
      workoutSession,
      trackProgress,
      performance,
      status,
      builder: builder.id,
      workout: workoutId,
    });

    await progress.save();

    return {
      ...progress._doc,
      id: progress.id,
    };
  }

  // Update the progress properties using PATCH request
  public async updateProperties(
    id: string,
    { workoutSession, trackProgress, performance, status }: UpdatePropertiesParam,
    user: any
  ): Promise<any> {
    const progress: any = await Progress.findById(id);
    if (!progress) throw notFound();

    const payload: any = { workoutSession, trackProgress, performance, status };

    // Only admin can update status
    Object.keys(payload).forEach((key) => {
      if (
        user.role !== 'admin' ||
        (user.role === 'admin' && user.status !== 'approved' && key === 'status')
      )
        throw badRequest('Only admin can update status');

      progress[key] = payload[key] ?? progress[key];
    });

    await progress.save();

    return {
      ...progress._doc,
      id: progress.id,
    };
  }

  // Remove the progress by id
  public async removeItem(id: string): Promise<IProgress | null> {
    const progress = await Progress.findById(id);
    if (!progress) throw notFound();

    return Progress.findByIdAndDelete(id);
  }

  // Check ownership of the progress
  public async checkOwnership({ resourceId, userId }: CheckOwnershipParam): Promise<boolean> {
    const progress = await Progress.findById(resourceId);
    if (!progress) throw notFound();

    return progress.builder._id.toString() === userId ? true : false;
  }
}

const progressService = new ProgressService();

export default progressService;
