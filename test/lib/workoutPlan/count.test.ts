import workoutPlanService from '../../../src/lib/workoutPlan';
import WorkoutPlan from '../../../src/model/WorkoutPlan';

// Mock the WorkoutPlan model
jest.mock('../../../src/model/WorkoutPlan');

describe('count service', () => {
  it('should return the count of workout plans based on the filter', async () => {
    // Create a mock for the count method of the WorkoutPlan model
    const mockCount = jest.fn();

    WorkoutPlan.count = mockCount;
    mockCount.mockResolvedValue(3); // Mock the count to return 3 for testing purposes

    // Call the count function with a filter
    const result = await workoutPlanService.count({
      search: 'Plan',
    });

    // Assertions
    expect(result).toEqual(3);

    // Verify that the count method was called with the correct filter
    expect(mockCount).toHaveBeenCalledWith({
      name: { $regex: 'Plan', $options: 'i' },
    });
  });
});
