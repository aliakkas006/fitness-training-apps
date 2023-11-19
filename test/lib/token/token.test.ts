import tokenService from '../../../src/lib/token';

describe('Token Service Test', () => {
  describe('Generate access token', () => {
    it('should generate an access token', () => {
      const payload = { id: 'user123', name: 'Test User' };
      const accessToken = tokenService.generateAccessToken({ payload });
      expect(accessToken).toBeTruthy();
    });
  });

  describe('Decode Token', () => {
    it('should decode a token', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const decoded = tokenService.decodeToken({ token });
      expect(decoded).toBeTruthy();
    });
  });

  describe('Verify Token', () => {
    it('should throw an error for an invalid token', () => {
      const invalidToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6y';
      expect(() => {
        tokenService.verifyToken({ token: invalidToken });
      }).toThrowError();
    });
  });

});
