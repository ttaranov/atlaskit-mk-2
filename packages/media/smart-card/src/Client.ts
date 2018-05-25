// TODO: introduce some form of caching???
// TODO: introduce the ability to cancel requests

export interface ObjectInfo {
  meta: {
    visibility: 'public' | 'restricted' | 'other';
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

  async get(url: string): Promise<ObjectInfo | undefined> {
    return new Promise<ObjectInfo | undefined>((resolve, reject) => {
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
    });

    // const res = await fetch(`${this.baseUrl}/resolve`, {
    //   method: 'POST',
    //   headers: {
    //     'Cache-Control': 'no-cache',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     resourceUrl: encodeURI(url)
    //   }),
    // });
    // const json = await res.json();
    // if (!json.response.body) {
    //   throw new Error('Invalid response.');
    // }
    // return json.response.body;
  }
}
