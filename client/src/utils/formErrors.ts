import { ApiRequestError } from '../api/client';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function applyApiErrorsToForm<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallbackMessage = 'Something went wrong. Please try again.',
): string {
  if (error instanceof ApiRequestError) {
    if (error.errors?.length) {
      for (const fieldError of error.errors) {
        setError(fieldError.field as Path<T>, {
          message: fieldError.message,
        });
      }
      return error.message;
    }

    return error.message;
  }

  return fallbackMessage;
}
