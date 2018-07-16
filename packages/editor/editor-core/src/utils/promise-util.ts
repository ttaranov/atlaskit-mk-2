export const promiseAllWithNonFailFast = (
  promises: Promise<any>[],
  errorCollector?: (error) => void,
) => {
  const wrappedPromises = promises
    .map(p => (!p ? Promise.resolve(undefined) : p)) // wrap undefined with a Promise
    .map(p =>
      p.catch(error => {
        if (errorCollector) {
          errorCollector(error);
        }
      }),
    );
  return Promise.all(wrappedPromises);
};
