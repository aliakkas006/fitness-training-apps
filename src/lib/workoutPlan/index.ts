import WorkoutPlan from '../../model/WorkoutPlan';
import defaults from '../../config/defaults';
import { badRequest, notFound } from '../../utils/error';
import Progress from '../../model/Progress';
import {
  CheckOwnershipParam,
  WorkoutCreateProps,
  WorkoutUpdateProps,
} from '../../types/interfaces';
import { WStatus } from '../../types/enums';

class WorkoutPlanService {
  /**
   * Finds all workout plans with optional filtering, sorting, and pagination.
   * @param {Object} params - Query parameters including page, limit, sortType, sortBy, and search.
   * @returns {Promise<any>} - A list of filtered and paginated workout plans.
   */
  public async findAllItems({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
  }: {
    page?: number;
    limit?: number;
    sortType?: string;
    sortBy?: string;
    search?: string;
  }): Promise<any> {
    const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
      name: { $regex: search, $options: 'i' },
    };

    const workouts = await WorkoutPlan.find(filter)
      .populate({ path: 'builder', select: 'name' })
      .sort(sortStr)
      .skip((page - 1) * limit)
      .limit(limit);

    return workouts.map((workout) => ({
      ...workout.toObject(),
      id: workout.id,
    }));
  }

  /**
   * Counts the number of workout plans matching the provided filters.
   * @param {Object} params - Parameters including search.
   * @returns {Promise<number>} - The count of matching workout plans.
   */
  public async count({ search = defaults.search }: { search?: string }): Promise<number> {
    const filter = {
      name: { $regex: search, $options: 'i' },
    };
    return WorkoutPlan.countDocuments(filter);
  }

  /**
   * Creates a new workout plan.
   * @param {WorkoutCreateProps} params - Workout plan details including name, mode, equipment, exercises, trainerTips, photo, status, and builder.
   * @returns {Promise<any>} - The newly created workout plan.
   * @throws {Error} - Throws an error if required parameters are missing.
   */
  public async create({
    name,
    mode,
    equipment,
    exercises,
    trainerTips,
    photo = '',
    status = WStatus.PROGRESS,
    builder,
  }: WorkoutCreateProps): Promise<any> {
    if (!name || !mode || !equipment || !exercises || !trainerTips || !builder) {
      throw badRequest('Invalid parameters!');
    }

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

    await workoutPlan.save();

    return {
      ...workoutPlan.toObject(),
      id: workoutPlan.id,
    };
  }

  /**
   * Finds a single workout plan by ID with optional expansion of related fields.
   * @param {Object} params - Parameters including id and expand.
   * @returns {Promise<any>} - The found workout plan.
   * @throws {Error} - Throws an error if the ID is not provided or if the workout plan is not found.
   */
  public async findSingleItem({ id, expand = '' }: { id: string; expand?: string }): Promise<any> {
    if (!id) {
      throw badRequest('ID is required');
    }

    const workoutPlan = await WorkoutPlan.findById(id);
    if (!workoutPlan) {
      throw notFound();
    }

    const expansions = expand.split(',').map((item) => item.trim());

    if (expansions.includes('builder')) {
      await workoutPlan.populate({ path: 'builder', select: 'name', strictPopulate: false });
    }

    if (expansions.includes('progress')) {
      await workoutPlan.populate({ path: 'progresses', strictPopulate: false });
    }

    return {
      ...workoutPlan.toObject(),
      id: workoutPlan.id,
    };
  }

  /**
   * Updates or creates a workout plan using a PUT request.
   * @param {string} id - The ID of the workout plan to update or create.
   * @param {WorkoutCreateProps} params - Workout plan details including name, mode, equipment, exercises, trainerTips, photo, status, and builder.
   * @returns {Promise<{ workoutPlan: any; code: number }>} - The updated or created workout plan and the HTTP status code.
   */
  public async updateOrCreate(
    id: string,
    {
      name,
      mode,
      equipment,
      exercises,
      trainerTips,
      photo = '',
      status = WStatus.PROGRESS,
      builder,
    }: WorkoutCreateProps
  ): Promise<{ workoutPlan: any; code: number }> {
    let workoutPlan = await WorkoutPlan.findById(id);

    if (!workoutPlan) {
      workoutPlan = await this.create({
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
      workoutPlan: { ...workoutPlan.toObject(), id: workoutPlan.id },
      code: 200,
    };
  }

  /**
   * Updates workout plan properties using a PATCH request.
   * @param {string} id - The ID of the workout plan to update.
   * @param {WorkoutUpdateProps} updates - The properties to update.
   * @returns {Promise<any>} - The updated workout plan.
   * @throws {Error} - Throws an error if the workout plan is not found.
   */
  public async updateProperties(
    id: string,
    { name, mode, equipment, exercises, trainerTips, photo, status }: WorkoutUpdateProps
  ): Promise<any> {
    const workoutPlan = await WorkoutPlan.findById(id);
    if (!workoutPlan) {
      throw notFound();
    }

    const payload = { name, mode, equipment, exercises, trainerTips, photo, status };

    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        workoutPlan[key] = payload[key];
      }
    });

    await workoutPlan.save();
    return {
      ...workoutPlan.toObject(),
      id: workoutPlan.id,
    };
  }

  /**
   * Deletes a workout plan by ID and asynchronously deletes all associated progress data.
   * @param {string} id - The ID of the workout plan to delete.
   * @returns {Promise<any>} - The deleted workout plan.
   * @throws {Error} - Throws an error if the workout plan is not found.
   */
  public async removeItem(id: string): Promise<any> {
    const workoutPlan = await WorkoutPlan.findById(id);
    if (!workoutPlan) {
      throw notFound('Resource not found!');
    }

    const progressIds = await Progress.find({ workout: id }).distinct('_id');
    if (progressIds.length > 0) {
      await Progress.deleteMany({ _id: { $in: progressIds } });
    }

    return WorkoutPlan.findByIdAndDelete(id);
  }

  /**
   * Checks if the user owns the workout plan.
   * @param {CheckOwnershipParam} params - Parameters including resourceId and userId.
   * @returns {Promise<boolean>} - True if the user owns the workout plan, otherwise false.
   * @throws {Error} - Throws an error if the workout plan is not found.
   */
  public async checkOwnership({ resourceId, userId }: CheckOwnershipParam): Promise<boolean> {
    const workoutPlan = await WorkoutPlan.findById(resourceId);
    if (!workoutPlan) {
      throw notFound();
    }

    return workoutPlan.builder._id.toString() === userId;
  }
}

// Create an instance of WorkoutPlanService
const workoutPlanService = new WorkoutPlanService();

export default workoutPlanService;
