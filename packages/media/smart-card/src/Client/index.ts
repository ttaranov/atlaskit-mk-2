import { ObjectStateProvider } from './ObjectStateProvider';

export interface ClientOptions {
  serviceUrl?: string;
}

export class Client {
  private readonly serviceUrl: string;

  constructor(options: ClientOptions = {}) {
    const {
      serviceUrl = 'https://api-private.stg.atlassian.com/object-resolver',
    } = options;
    this.serviceUrl = serviceUrl;
  }

  get(url: string): ObjectStateProvider {
    return new ObjectStateProvider({
      serviceUrl: this.serviceUrl,
      objectUrl: url,
    });
  }
}
