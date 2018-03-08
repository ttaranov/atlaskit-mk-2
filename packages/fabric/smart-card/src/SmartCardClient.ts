// TODO: introduce some form of caching???

export interface SmartCardClientOptions {
  baseUrl?: string;
}

export class SmartCardClient {
  private readonly baseUrl: string;

  constructor(options: SmartCardClientOptions = {}) {
    const {
      baseUrl = 'https://wt-34857ffa982ba1dd8c0b8b61fe8d2c53-0.sandbox.auth0-extend.com',
    } = options;
    this.baseUrl = baseUrl;
  }

  async fetch(url: string) {
    const res = await fetch(`${this.baseUrl}/trello-smartcard`, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: `{"resourceUrl": "${encodeURI(url)}"}`,
    });
    const json = await res.json();
    return json;
  }
}
