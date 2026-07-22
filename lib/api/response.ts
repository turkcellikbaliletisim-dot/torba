export interface ApiSuccess<T> {
  success: true;
  data: T;
  correlationId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  correlationId: string;
}

export function apiSuccess<T>(data: T, correlationId: string): ApiSuccess<T> {
  return {
    success: true,
    data,
    correlationId,
  };
}

export function apiError(
  code: string,
  message: string,
  correlationId: string,
  details?: unknown,
): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
    correlationId,
  };
}
