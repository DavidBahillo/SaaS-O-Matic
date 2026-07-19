export class ApiError extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function badRequest(message: string, code = 'VALIDATION_ERROR'): ApiError {
  return new ApiError(400, code, message);
}

export function notFound(message: string, code = 'NOT_FOUND'): ApiError {
  return new ApiError(404, code, message);
}

export function conflict(message: string, code = 'CONFLICT'): ApiError {
  return new ApiError(409, code, message);
}

export function unauthorized(message: string, code = 'UNAUTHORIZED'): ApiError {
  return new ApiError(401, code, message);
}

export function forbidden(message: string, code = 'FORBIDDEN'): ApiError {
  return new ApiError(403, code, message);
}
