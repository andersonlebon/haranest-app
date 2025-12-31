import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: unknown,
  status: number = 500,
  defaultMessage: string = 'An error occurred'
): NextResponse {
  const message = getErrorMessage(error) || defaultMessage;
  console.error(`API Error (${status}):`, error);
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wrap route handler with error handling
 */
export function withErrorHandler<T = unknown>(
  handler: (req: NextRequest, context?: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: T): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

/**
 * Parse array query parameter
 */
export function getArrayParam(searchParams: URLSearchParams, key: string): string[] {
  return searchParams.getAll(key).filter(Boolean);
}

/**
 * Parse number array query parameter
 */
export function getNumberArrayParam(searchParams: URLSearchParams, key: string): number[] {
  return searchParams.getAll(key).map(Number).filter((n) => !isNaN(n));
}

/**
 * Parse number query parameter with default
 */
export function getNumberParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number = 0
): number {
  const value = searchParams.get(key);
  if (!value) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse string query parameter
 */
export function getStringParam(
  searchParams: URLSearchParams,
  key: string
): string | undefined {
  const value = searchParams.get(key);
  return value || undefined;
}

