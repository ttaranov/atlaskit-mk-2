// TODO: introduce some form of caching???

export interface ClientOptions {
  baseUrl?: string;
}

export class Client {
  private readonly baseUrl: string;

  constructor(options: ClientOptions = {}) {
    const {
      baseUrl = 'https://cs-rpc.us-west-1.staging.public.atl-paas.net/invoke',
    } = options;
    this.baseUrl = baseUrl;
  }

  async get(url: string) {
    const res = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aaid: '9902257f-b119-4ee1-84a9-442abe8baf04',
        definitionId: '038b410a-9cfe-4a16-91df-93051fad6b48',
        extensionKey: 'trello-smart-card-test',
        spiField: 'resolve',
        headers: {
          'Cache-Control': 'no-cache',
        },
        body: {
          resourceUrl: encodeURI(url),
        },
      }),
    });
    const json = await res.json();
    if (!json.response.body) {
      throw new Error('Invalid response.');
    }
    return json.response.body;
  }
}
