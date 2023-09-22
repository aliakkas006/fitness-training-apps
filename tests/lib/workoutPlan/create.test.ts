import workoutPlanService from '../../../src/lib/workoutPlan';
import WorkoutPlan from '../../../src/model/WorkoutPlan';

// Mock the WorkoutPlan model
jest.mock('../../../src/model/WorkoutPlan');

describe('Create workout plan service', () => {
  it('should create a new workout plan and return the created plan', async () => {
    // Mock input data for the create function
    const input = {
      name: 'Test Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slow and focus on form'],
      builder: { id: 'user123' },
    };

    // Create a mock instance of the WorkoutPlan model
    const mockSave = jest.fn();
    const mockWorkoutPlan = new WorkoutPlan(input);
    mockWorkoutPlan.save = mockSave;

    // Call the create function with the input data
    const result = await workoutPlanService.create(input);
    // Assertions
    expect(result).toEqual({
      id: expect.any(String),
      ...input,
    });

    // Verify that the save method was called with the correct data
    expect(mockSave).toHaveBeenCalledWith();
  });
});
