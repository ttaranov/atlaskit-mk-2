import CancelablePromise from '@jameslnewell/cancelable-promise';

// TODO: introduce some form of caching???

export interface ObjectInfo {
  meta: {
    visibility: 'public' | 'restricted' | 'other';
    access: 'granted' | 'unauthorised' | 'forbidden';
  };
  data?: {
    [name: string]: any;
  };
}

export interface ClientOptions {
  baseUrl?: string;
}

export class Client {
  private readonly baseUrl: string;

  constructor(options: ClientOptions = {}) {
    const {
      baseUrl = 'https://api-private.stg.atlassian.com/object-resolver',
    } = options;
    this.baseUrl = baseUrl;
  }

  get(url: string): CancelablePromise<ObjectInfo | undefined> {
    return new CancelablePromise<ObjectInfo | undefined>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('post', `${this.baseUrl}/resolve`);
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.addEventListener('error', () => reject());
      xhr.addEventListener('load', () => {
        switch (xhr.status) {
          case 200:
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json as ObjectInfo);
            } catch (error) {
              reject(error);
            }
            break;

          case 404:
            resolve(undefined);
            break;

          default:
            reject(new Error('Unsupported response.'));
        }
      });
      xhr.send(
        JSON.stringify({
          resourceUrl: encodeURI(url),
        }),
      );
      return () => xhr.abort();
    });
  }
}
