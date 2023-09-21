import workoutPlanService from '../../../src/lib/workoutPlan';
import WorkoutPlan from '../../../src/model/WorkoutPlan';
import defaults from '../../../src/config/defaults';

// Mock the WorkoutPlan model
jest.mock('../../../src/model/WorkoutPlan');

describe('findAllItems service', () => {
  it('should return a list of workout plans', async () => {
    const mockFind = jest.fn();

    WorkoutPlan.find = mockFind;
    mockFind.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        {
          _doc: {
            _id: '1',
            name: 'Workout Plan 1',
            mode: 'Beginner',
            equipment: ['Dumbbells', 'Bench'],
            exercises: ['Push-ups', 'Squats'],
            builder: 'user123',
          },
        },

        {
          _doc: {
            _id: '2',
            name: 'Workout Plan 2',
            mode: 'Intermediate',
            equipment: ['Barbell', 'Bench'],
            exercises: ['Deadlift', 'Bicep Curls'],
            builder: 'user1245',
          },
        },
      ]),
    });

    // Call the findAllItems function
    const result = await workoutPlanService.findAllItems({
      page: defaults.page,
      limit: defaults.limit,
      sortType: defaults.sortType,
      sortBy: defaults.sortBy,
      search: defaults.search,
    });

    // Assertions
    expect(result).toEqual([
      {
        id: '1',
        name: 'Workout Plan 1',
        mode: 'Beginner',
        equipment: ['Dumbbells', 'Bench'],
        exercises: ['Push-ups', 'Squats'],
        builder: 'user123',
      },

      {
        id: '2',
        name: 'Workout Plan 2',
        mode: 'Intermediate',
        equipment: ['Barbell', 'Bench'],
        exercises: ['Deadlift', 'Bicep Curls'],
        builder: 'user1245',
      },
    ]);
    expect(WorkoutPlan.find).toHaveBeenCalledWith({
      name: { $regex: defaults.search, $options: 'i' },
    });

    expect(mockFind().exec).toHaveBeenCalled();

    expect(Array.isArray(result)).toBe(true);
  });
});
