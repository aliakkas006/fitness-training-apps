import workoutPlanService from '../../../src/lib/workoutPlan';

jest.mock('../../../src/lib/workoutPlan', () => ({
  removeItem: jest.fn(),
}));

describe('remove workout plan service', () => {
  it('should remove workout plan', async () => {
    const mockWorkoutPlan = {
      id: 'test123',
      name: 'Test Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slow and focus on form'],
      photo: 'test.jpg',
      status: 'PROGRESS',
      builder: { id: 'user123' },
    };

    (workoutPlanService.removeItem as jest.Mock).mockResolvedValue(mockWorkoutPlan);

    const workoutPlan = await workoutPlanService.removeItem('test123');

    expect(workoutPlan).toEqual(mockWorkoutPlan);
  });
});

