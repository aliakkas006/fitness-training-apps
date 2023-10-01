import defaults from '../../config/defaults';
import Progress from '../../model/Progress';
import WorkoutPlan from '../../model/WorkoutPlan';
import { Status } from '../../types/enums';
import { CheckOwnershipParam, IProgress, ProgressUpdateProps } from '../../types/interfaces';
import { badRequest, notFound } from '../../utils/error';

class ProgressService {
  // Find all progress data
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    user,
  }: any) {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
    let progressIds;

    // If the user is admin, fetch all progress Ids. If the user is not an admin, fetch progress IDs for the specific builder (user)
    if (user.role === 'admin') {
      progressIds = await Progress.find({}).distinct('_id');
    } else {
      progressIds = await Progress.find({ builder: user.id }).distinct('_id');
    }

    if (progressIds.length > 0) {
      const progresses = await Progress.find({ _id: { $in: progressIds } })
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
    } else {
      throw notFound();
    }
  }

  // total progress count based on user's role
  public async count({ user }: any) {
    if (user.role === 'admin') {
      return Progress.count({});
    } else {
      return Progress.count({ builder: user.id });
    }
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

    const newProgress = await progress.save();

    await WorkoutPlan.updateOne(
      {
        _id: workoutId,
      },
      {
        $push: {
          progresses: newProgress._id,
        },
      }
    );

    return {
      ...progress._doc,
      id: progress.id,
    };
  }

  // Update the progress properties using PATCH request
  public async updateProperties(
    id: string,
    { workoutSession, trackProgress, performance, status }: ProgressUpdateProps
  ): Promise<any> {
    const progress: any = await Progress.findById(id);
    if (!progress) throw notFound();

    const payload: any = { workoutSession, trackProgress, performance, status };

    Object.keys(payload).forEach((key) => {
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
