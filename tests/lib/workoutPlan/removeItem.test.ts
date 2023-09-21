import workoutPlanService from '../../../src/lib/workoutPlan';
import WorkoutPlan from '../../../src/model/WorkoutPlan';
import Progress from '../../../src/model/Progress';
import { notFound } from '../../../src/utils/error';

// Mock the WorkoutPlan and Progress models
jest.mock('../../../src/model/WorkoutPlan');
jest.mock('../../../src/model/Progress');

describe('remove workout plan service', () => {
  it('should remove a workout plan by ID and associated progress data', async () => {
    // Mock input data for the removeItem function
    const planId = 'plan123';

    // Mock a workout plan document
    const mockWorkoutPlan = {
      _id: 'someWorkoutPlanId',
      name: 'Sample Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
      builder: { id: 'user123' },
    };

    // Mock the findById and findByIdAndDelete methods of WorkoutPlan
    WorkoutPlan.findById = jest.fn().mockResolvedValue(mockWorkoutPlan);
    WorkoutPlan.findByIdAndDelete = jest.fn().mockResolvedValue(mockWorkoutPlan);

    // Mock Progress.find method to return an array of progress objects
    const mockProgress = [
      { _id: 'progress1', workout: planId },
      { _id: 'progress2', workout: planId },
    ];
    Progress.find = jest.fn().mockResolvedValue(mockProgress);

    // Mock Progress.deleteMany method
    Progress.deleteMany = jest.fn().mockResolvedValue({ n: 2 });

    // Call the removeItem function with the planId
    const result = await workoutPlanService.removeItem(planId);

    // Assertions
    expect(result).toEqual(mockWorkoutPlan);
    expect(WorkoutPlan.findById).toHaveBeenCalledWith(planId);
    expect(Progress.find).toHaveBeenCalledWith({ workout: planId });
    expect(Progress.deleteMany).toHaveBeenCalledWith({ _id: { $in: ['progress1', 'progress2'] } });
    expect(WorkoutPlan.findByIdAndDelete).toHaveBeenCalledWith(planId);
  });

  it('should throw a notFound error if the workout plan does not exist', async () => {
    const planId = 'nonExistentPlanId';

    WorkoutPlan.findById = jest.fn().mockResolvedValue(null);

    await expect(workoutPlanService.removeItem(planId)).rejects.toThrowError(
      notFound('Resource not found!')
    );
  });
});
