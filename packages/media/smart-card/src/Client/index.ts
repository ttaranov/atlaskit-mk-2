import { Subject } from 'rxjs';
import { Command } from './Command';
import { ObjectStateProvider } from './ObjectStateProvider';

// TODO: improve pooling e.g. remove items from the pool to avoid memory leaks
// TODO: add some form of caching so that urls not currently loaded will still be fast

export interface ClientOptions {
  serviceUrl?: string;
}

export class Client {
  private readonly serviceUrl: string;
  private readonly providers: Map<string, ObjectStateProvider> = new Map();

  /*
    This subject is used to trigger a refresh on all the object URLs for a specific provider
   */
  private readonly $reload: Subject<Command> = new Subject();

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
        $reload: this.$reload,
      });
      this.providers.set(url, provider);
    }
    return provider;
  }
}
