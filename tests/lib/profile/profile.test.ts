import profileService from '../../../src/lib/profile';

describe('Profile Service', () => {
  describe('findAllItems', () => {
    it('should find all profiles based on filters', async () => {
      // Add test data and call the service function
      const filters = {
        firstName: 'Ali',
        lastName: 'akkas',
        email: 'akkas@gmail.com',
      };
      const profiles = await profileService.findAllItems(filters);

      // Assertions
      expect(profiles).toHaveLength(1);
      expect(profiles[0]).toHaveProperty('firstName', 'Ali');
      expect(profiles[0]).toHaveProperty('lastName', 'Akkas');
    });

    it('should handle empty filters', async () => {
      const profiles = await profileService.findAllItems({});

      // Assertions
      expect(profiles).toHaveLength(1);
    });
  });

//   describe('count', () => {
//     it('should count profiles based on filters', async () => {
//       const filters = {
//         firstName: 'Ali',
//         lastName: 'akkas',
//         email: 'akkas@gmail.com',
//       };
//       const count = await profileService.count(filters);

//       // Assertions
//       expect(count).toBeGreaterThan(0);
//     });
//   });

//   describe('create', () => {
//     it('should create a new profile', async () => {
//       const profileData = {
//         firstName: 'Jane',
//         lastName: 'Doe',
//         email: 'janedoe@example.com',
//         age: 25,
//         height: 6,
//         weight: 60,
//         fitnessLevel: 'beginner',
//         goal: 'maintain_fitness',
//         user: { id: 'user123' },
//       };
//       const newProfile = await profileService.create(profileData);

//       // Assertions
//       expect(newProfile).toHaveProperty('firstName', 'Ali');
//       expect(newProfile).toHaveProperty('lastName', 'Akkas');
//     });

//     it('should throw an error for invalid parameters', async () => {
//       const invalidProfileData = {
//         firstName: 'John',
//         // Missing other required properties
//       };

//       await expect(() => profileService.create(invalidProfileData)).rejects.toThrowError();
//     });
//   });
});
