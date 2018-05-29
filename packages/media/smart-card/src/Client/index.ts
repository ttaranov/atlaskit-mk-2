import { ObjectStateProvider } from './ObjectStateProvider';

// TODO: improve pooling
// TODO: add some form of caching

export interface ClientOptions {
  serviceUrl?: string;
}

export class Client {
  private readonly serviceUrl: string;

  private providers: Map<string, ObjectStateProvider> = new Map();

  constructor(options: ClientOptions = {}) {
    const {
      serviceUrl = 'https://api-private.stg.atlassian.com/object-resolver',
    } = options;
    this.serviceUrl = serviceUrl;
  }

  get(url: string): ObjectStateProvider {
    // TODO: clear pool when item is no longer used
    let provider = this.providers.get(url);
    if (!provider) {
      provider = new ObjectStateProvider({
        serviceUrl: this.serviceUrl,
        objectUrl: url,
      });
      this.providers.set(url, provider);
    }
    return provider;
  }
}
