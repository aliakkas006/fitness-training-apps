class CustomError extends Error {
  status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

export const notFound = (msg = 'Resource Not Found') => new CustomError(msg, 404);
export const badRequest = (msg = 'Bad Request') => new CustomError(msg, 400);
export const serverError = (msg = 'Internal Server Error') => new CustomError(msg, 500);
export const authenticationError = (msg = 'Authentication Failed') => new CustomError(msg, 401);
export const authorizationError = (msg = 'Permission Denied') => new CustomError(msg, 403);
