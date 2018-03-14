export type Task<T> = () => Promise<T>;

export function retryTask<T>(
  task: Task<T>,
  retries: number,
  initialDelay: number = 1000,
  delayMultiplier: number = 1,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const loop = (retriesLeft: number, delay: number) => {
      if (retriesLeft > 0) {
        task()
          .then(resolve)
          .catch(ignored => {
            setTimeout(() => {
              loop(retriesLeft - 1, delay * delayMultiplier);
            }, delay);
          });
      } else {
        task()
          .then(resolve)
          .catch(reject);
      }
    };

    loop(retries, initialDelay);
  });
}
