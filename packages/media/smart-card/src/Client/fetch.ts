import CancelablePromise from '@jameslnewell/cancelable-promise';

export function fetch<T>(
  method: string,
  url: string,
  data?: any,
): CancelablePromise<T | undefined> {
  return new CancelablePromise<T | undefined>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('error', () => reject());
    xhr.addEventListener('load', () => {
      switch (xhr.status) {
        case 200:
          try {
            const json = JSON.parse(xhr.responseText);
            resolve(json as T);
          } catch (error) {
            reject(error);
          }
          break;

        case 404:
          resolve(undefined);
          break;

        default:
          reject(
            new Error(
              '@atlaskit/smart-card: Recieved an unsupported response.',
            ),
          );
      }
    });
    xhr.send(data ? JSON.stringify(data) : undefined);
    return () => xhr.abort();
  });
}
