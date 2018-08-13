import { Observable } from 'rxjs/Observable';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

export default function<T>(
  method: string,
  url: string,
  data?: any,
): Observable<T> {
  return new Observable(observer => {
    const AC = new AbortController();
    const requestConfig = {
      method,
      signal: AC.signal,
      credentials: 'include' as RequestCredentials,
      headers: {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...(data ? { body: JSON.stringify(data) } : {}),
    };

    fetch(url, requestConfig)
      .then(resp => resp.ok && resp.json())
      .then(res => {
        observer.next(res as T);
        observer.complete();
      })
      .catch(observer.error.bind(observer));

    return () => AC.abort();
  });
}
