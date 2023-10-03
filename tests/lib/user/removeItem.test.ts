import userService from '../../../src/lib/user';

jest.mock('../../../src/lib/user', () => ({
    removeItem: jest.fn(),
  }));

  describe('remove user service', () => {   
    it('should remove a user', async () => {
      // Mock input data for the remove function
      const input = {
        id: 'user123',
      };
      // Mock a user document
      const mockUser = {
        id: 'user123',
      };
      (userService.removeItem as jest.Mock).mockResolvedValue(mockUser);
      // Call the remove function with the input data
      const result = await userService.removeItem(input.id);
      // Assertions
      expect(userService.removeItem).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });
