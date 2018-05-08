// TODO: introduce some form of caching???

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

  async get(url: string) {
    const res = await fetch(`${this.baseUrl}/resolve`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceUrl: encodeURI(url),
      }),
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.response.body) {
      throw new Error('Invalid response.');
    }
    return json.response.body;
  }
}
