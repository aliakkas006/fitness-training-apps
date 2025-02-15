import defaults from '../../config/defaults';
import Progress from '../../model/Progress';
import WorkoutPlan from '../../model/WorkoutPlan';
import { Status } from '../../types/enums';
import { CheckOwnershipParam, IProgress, ProgressUpdateProps } from '../../types/interfaces';
import { badRequest, notFound } from '../../utils/error';

class ProgressService {
  /**
   * Finds all progress data with optional filtering, sorting, and pagination.
   * @param {Object} params - Query parameters including page, limit, sortType, sortBy, and user.
   * @returns {Promise<IProgress[]>} - A list of filtered and paginated progress data.
   * @throws {Error} - Throws an error if no progress data is found.
   */
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    user,
  }: {
    page?: number;
    limit?: number;
    sortType?: string;
    sortBy?: string;
    user: { id: string; role: string };
  }): Promise<IProgress[]> {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;

    // Fetch progress IDs based on user role
    const progressIds = await Progress.find(
      user.role === 'admin' ? {} : { builder: user.id }
    ).distinct('_id');

    if (progressIds.length === 0) {
      throw notFound();
    }

    const progresses = await Progress.find({ _id: { $in: progressIds } })
      .populate([
        { path: 'builder', select: 'name' },
        { path: 'workout', select: 'name' },
      ])
      .sort(sortStr)
      .skip((page - 1) * limit)
      .limit(limit);

    return progresses.map((progress) => ({
      ...progress.toObject(),
      id: progress.id,
    }));
  }

  /**
   * Counts the number of progress entries based on the user's role.
   * @param {Object} params - Parameters including user.
   * @returns {Promise<number>} - The count of progress entries.
   */
  public async count({ user }: { user: { id: string; role: string } }): Promise<number> {
    return Progress.countDocuments(user.role === 'admin' ? {} : { builder: user.id });
  }

  /**
   * Creates a new progress entry.
   * @param {Object} params - Progress details including workoutSession, trackProgress, performance, workoutId, status, and builder.
   * @returns {Promise<IProgress>} - The newly created progress entry.
   * @throws {Error} - Throws an error if required parameters are missing or if the workout plan is not found.
   */
  public async create({
    workoutSession,
    trackProgress,
    performance,
    workoutId,
    status = Status.PUBLIC,
    builder,
  }: {
    workoutSession: string;
    trackProgress: string;
    performance: string;
    workoutId: string;
    status?: Status;
    builder: { id: string };
  }): Promise<IProgress> {
    if (!workoutSession || !trackProgress || !performance || !workoutId || !builder) {
      throw badRequest('Invalid parameters!');
    }

    const workoutPlan = await WorkoutPlan.findById(workoutId);
    if (!workoutPlan) {
      throw notFound();
    }

    const progress: any = new Progress({
      workoutSession,
      trackProgress,
      performance,
      status,
      builder: builder.id,
      workout: workoutId,
    });

    const newProgress = await progress.save();

    // Update the associated workout plan with the new progress ID
    await WorkoutPlan.updateOne({ _id: workoutId }, { $push: { progresses: newProgress._id } });

    return {
      ...progress.toObject(),
      id: progress.id,
    };
  }

  /**
   * Updates progress properties using a PATCH request.
   * @param {string} id - The ID of the progress entry to update.
   * @param {ProgressUpdateProps} updates - The properties to update.
   * @returns {Promise<IProgress>} - The updated progress entry.
   * @throws {Error} - Throws an error if the progress entry is not found.
   */
  public async updateProperties(id: string, updates: ProgressUpdateProps): Promise<IProgress> {
    const progress: any = await Progress.findById(id);

    if (!progress) {
      throw notFound();
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        progress[key] = updates[key];
      }
    });

    await progress.save();
    return {
      ...progress.toObject(),
      id: progress.id,
    };
  }

  /**
   * Removes a progress entry by ID.
   * @param {string} id - The ID of the progress entry to remove.
   * @returns {Promise<IProgress | null>} - The deleted progress entry.
   * @throws {Error} - Throws an error if the progress entry is not found.
   */
  public async removeItem(id: string): Promise<IProgress | null> {
    const progress = await Progress.findById(id);
    if (!progress) {
      throw notFound();
    }

    return Progress.findByIdAndDelete(id);
  }

  /**
   * Checks if the user owns the progress entry.
   * @param {CheckOwnershipParam} params - Parameters including resourceId and userId.
   * @returns {Promise<boolean>} - True if the user owns the progress entry, otherwise false.
   * @throws {Error} - Throws an error if the progress entry is not found.
   */
  public async checkOwnership({ resourceId, userId }: CheckOwnershipParam): Promise<boolean> {
    const progress = await Progress.findById(resourceId);
    if (!progress) {
      throw notFound();
    }

    return progress.builder._id.toString() === userId;
  }
}

// Create an instance of ProgressService
const progressService = new ProgressService();

export default progressService;
