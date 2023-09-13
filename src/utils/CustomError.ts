class CustomError extends Error {
  status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

// TODO: either file name change or refactor this code
export const notFound = (msg = 'Resource Not Found') => {
  return new CustomError(msg, 404);
};

export const badRequest = (msg = 'Bad Request') => {
  return new CustomError(msg, 400);
};

export const serverError = (msg = 'Internal Server Error') => {
  return new CustomError(msg, 500);
};

export const authenticationError = (msg = 'Authentication Failed') => {
  return new CustomError(msg, 401);
};

export const authorizationError = (msg = 'Permission Denied') => {
  return new CustomError(msg, 403);
};
