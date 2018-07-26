import { Observable } from 'rxjs/Observable';

export default function<T>(
  method: string,
  url: string,
  data?: any,
): Observable<T | undefined> {
  return new Observable(observer => {
    const abortController = new AbortController();
    const requestConfig = {
      method,
      signal: abortController.signal,
      credentials: 'include' as RequestCredentials,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    };

    fetch(url, requestConfig)
      .then(resp => resp.json())
      .then(res => {
        observer.next(res as T);
        observer.complete();
      })
      .catch(err => observer.error(err));

    return () => abortController.abort();
  });
}
