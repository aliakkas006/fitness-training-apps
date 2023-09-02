import jwt from 'jsonwebtoken';
import {serverError} from '../../utils/CustomError';

// TODO: implement refresh token

class TokenService {
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.ACCESS_TOKEN_SECRET || 'secret-token';
  }

  generateToken({ payload, secret = this.accessToken, algorithm = 'HS256', expiresIn = '1h' }: any): string {
    try {
      return jwt.sign(payload, secret, { algorithm, expiresIn });
    } catch (err) {
      console.log('[JWT]', err);
      throw serverError();
    }
  }

  decodeToken({ token, algorithm = 'HS256' }: any) {
    try {
      return jwt.decode(token, algorithm);
    } catch (err) {
      console.log('[JWT]', err);
      throw serverError();
    }
  }

  verifyToken({ token, secret = this.accessToken || 'secret-token', algorithm = 'HS256' }: any) {
    try {
      return jwt.verify(token, secret, { algorithms: [algorithm] });
    } catch (err) {
      console.log('[JWT]', err);
      throw serverError();
    }
  }
}

const tokenService = new TokenService();

export default tokenService;
