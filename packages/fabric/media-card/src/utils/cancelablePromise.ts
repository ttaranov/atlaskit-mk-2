export class CanceledPromiseError extends Error {}

export interface CancelablePromise<T> extends Promise<T> {
  cancel(): void;
}

export const makeCancelablePromise = <T>(
  promise: Promise<T>,
): CancelablePromise<T> => {
  let hasCanceled = false;
  const newPromise = new Promise<T>((resolve, reject) => {
    const isCanceledError = new CanceledPromiseError(
      'Promise has been canceled',
    );
    promise
      .then(value => (hasCanceled && reject(isCanceledError)) || resolve(value))
      .catch(
        error => (hasCanceled && reject(isCanceledError)) || reject(error),
      );
  });

  return {
    then: newPromise.then,
    catch: newPromise.catch,
    cancel: () => {
      hasCanceled = true;
    },
  };
};
