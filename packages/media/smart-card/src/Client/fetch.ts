import { Observable } from 'rxjs/Observable';

export function fetch<T>(
  method: string,
  url: string,
  data?: any,
): Observable<T | undefined> {
  return Observable.create(observer => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('error', () => observer.error());
    xhr.addEventListener('load', () => {
      switch (xhr.status) {
        case 200:
          try {
            const json = JSON.parse(xhr.responseText);
            observer.next(json as T);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
          break;

        case 404:
          observer.next(undefined);
          observer.complete();
          break;

        default:
          observer.error(
            new Error(
              '@atlaskit/smart-card: Recieved an unsupported response.',
            ),
          );
      }
    });
    xhr.withCredentials = true;
    xhr.send(data ? JSON.stringify(data) : undefined);
    return () => xhr.abort();
  });
}
