export class CollectionNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = CollectionNotFoundError.name;
  }
}

export function isCollectionNotFoundError(
  error: Error,
): error is CollectionNotFoundError {
  return error.name === CollectionNotFoundError.name;
}

export function isError<T>(something: T | Error): something is Error {
  return something instanceof Error;
}
