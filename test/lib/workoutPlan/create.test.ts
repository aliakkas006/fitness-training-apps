import workoutPlanService from '../../../src/lib/workoutPlan';
import { WStatus } from '../../../src/types/enums';

jest.mock('../../../src/lib/workoutPlan', () => ({
  create: jest.fn(),
}));

describe('create workout plan service', () => {
  it('should create workout plan', async () => {
    const input = {
      name: 'Test Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slow and focus on form'],
      builder: { id: 'user123' },
    };

    const mockWorkoutPlan = {
      id: 'test',
      name: 'Test Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slow and focus on form'],
      photo: 'test.jpg',
      status: WStatus.PROGRESS,
      builder: { id: 'user123' },
    };

    (workoutPlanService.create as jest.Mock).mockResolvedValue(mockWorkoutPlan);

    const workoutPlan = await workoutPlanService.create(input);

    expect(workoutPlan).toEqual(mockWorkoutPlan);
  });
});
